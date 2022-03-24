import React from 'react';
import './BaseConverter.scss';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { AlertColor } from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import { convertBase } from 'simple-base-converter';
import { readText, writeText } from '@tauri-apps/api/clipboard';
import Box from '@mui/material/Box';
import ContentCopyIcon from '../../../icons/ContentCopyIcon';
import ContentPasteIcon from '../../../icons/ContentPasteIcon';
import ClearIcon from '../../../icons/ClearIcon';
import DeleteOutlineIcon from '../../../icons/DeleteOutlineIcon';

const getBaseName = (base: number) => {
    const names: any = {
        2: 'Binary',
        8: 'Octal',
        10: 'Decimal',
        16: 'Hex'    
    };
    return names[base] ? names[base] : 'Base' + base;
};

interface BaseInfo {
    base: number,
    value: string,
    error: boolean
}

interface Error {
    open: boolean,
    text: string,
    severity: AlertColor
}

function BaseConverter() {
    const [error, setError] = React.useState<Error>({open: false, text: '', severity: 'error'});
    const [baseList, setBaseList] = React.useState<BaseInfo[]>([
        {base: 2, error: false, value:''},
        {base: 8, error: false, value:''},
        {base: 10, error: false, value:''},
        {base: 16, error: false, value:''},
    ]);
    const [addBase, setAddBase] = React.useState('');
    const handleAddBase = () => {
        if (parseInt(addBase) < 2 || parseInt(addBase) > 62) {
            setError({open: true, text: 'Base number must be between 2 and 62.', severity: 'warning'});
            setAddBase('');
            return;
        }
        setBaseList(list => [...list, {base: parseInt(addBase), error: false, value:''}]);
        setAddBase('');
    };
    const calculateAllBases = (inputValue: string, base: number) => {
        let hasError = false;
        try {
            convertBase(inputValue, base, 10);
            setError(error => { return {open: false, text: error.text, severity: error.severity}});
        } catch (err) {
            hasError = true;
            if (inputValue)
                setError({open: true, text: inputValue + ' is not a valid ' + getBaseName(base) + ' value!', severity: 'error'});
        }
        setBaseList(list => {
            const clone = [...list];
            const baseInfo = clone.find(c => c.base === base)!;
            baseInfo.value = inputValue;
            if (hasError) {
                baseInfo.error = true;              
                return clone;
            } else {
                for (let bi of clone) {
                    if (bi.base === base) continue;
                    bi.value = convertBase(inputValue, base, bi.base);
                };
            }
            return clone;
        });
    };

    const handlePaste = async (base: number) => {
        const clipboardText = await readText() ?? '';
        calculateAllBases(clipboardText, base);
    };
    const handleCopy = async (base: number) => await writeText(baseList.find(b => b.base === base)!.value);
    const handleClear = () => setBaseList(list => {
        const clone = [...list];
        for (let bi of clone)
            bi.value = '';
        return clone;
    });
    const handleDelete = (base: number) => setBaseList(list => [...list].filter(b => b.base !== base));

    return (
        <div>
            <div className="top-row">
                <div className="add-base-container">
                    <TextField
                        className="add-base-input"
                        label="Number"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            inputProps: { 
                                max: 62, min: 2
                            }
                        }}
                        onChange={(event) => setAddBase(event.target.value)}
                        value={addBase}
                    />
                    <Button className="add-base-button" variant="outlined" onClick={handleAddBase}>Add Base</Button>
                </div>
                <Collapse in={error.open}>
                    <Alert
                        severity={error.severity}
                        action={
                            <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setError(error => { return {open: false, text: error.text, severity: error.severity}})}
                            >
                                <ClearIcon />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        >
                        {error.text}
                    </Alert>
                </Collapse>
            </div>

            <div className="group-container">
                {baseList.map(baseInfo => (
                    <Box className="base-input-container" key={baseInfo.base}>
                        <TextField className="base-input" label={getBaseName(baseInfo.base)}
                            onChange={event => calculateAllBases((event.target as any).value, baseInfo.base)} value={baseInfo.value}/>
                        <Tooltip title="Paste"><IconButton color="inherit" onClick={() => handlePaste(baseInfo.base)}><ContentPasteIcon /></IconButton></Tooltip>
                        <Tooltip title="Copy"><IconButton color="inherit" onClick={() => handleCopy(baseInfo.base)}><ContentCopyIcon /></IconButton></Tooltip>
                        <Tooltip title="Clear"><IconButton color="inherit" onClick={handleClear}><ClearIcon /></IconButton></Tooltip>
                        <Tooltip title="Delete"><IconButton color="inherit" onClick={() => handleDelete(baseInfo.base)}><DeleteOutlineIcon /></IconButton></Tooltip>
                    </Box>
                ))}
            </div>
        </div>
    );
}

export default BaseConverter