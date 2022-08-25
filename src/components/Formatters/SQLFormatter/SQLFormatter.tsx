import React from 'react';
import './SQLFormatter.scss';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputOutputEditors from '../../Common/InputOutputEditors';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { format } from 'sql-formatter';

const fileDialogFilters = [{ name: 'sql files', extensions: ['txt', 'sql'] }];
const formatSql = (input: string | undefined, language: string, indentation: string) => {
    try {
        const spaces = indentation === 'four' ? '    ' : (indentation === 'two' ? '  ' : '\t');
        const formattedText = format(input ?? '', { language: language as any, indent: spaces });
        return formattedText;
    } catch (error: any) {
        return 'Not a valid SQL!\n' + error.message;
    }
};

function SqlFormatter() {
    const editorRefs: React.MutableRefObject<any> = React.useRef();
    const [language, setLanguage] = React.useState('sql');
    const [indentation, setIndentation] = React.useState('four');

    const setOutputEditorText = (value: string | undefined, lang?: string, ind?: string) => {
        const outputEditor = editorRefs.current.outputEditor;
        if (outputEditor) {
            outputEditor.setValue(formatSql(value, lang ?? language, ind ?? indentation));
        }
    }

    const handleLanguageChange = (event: SelectChangeEvent) => {
        setLanguage(_ => {
            setOutputEditorText(
                editorRefs.current.outputEditor.getValue(),
                event.target.value,
                indentation);
            return event.target.value;
        });
    };

    const handleIndentationChange = (event: React.MouseEvent<HTMLElement>, newIndentation: string) => {
        setIndentation(_ => {
            setOutputEditorText(
                editorRefs.current.outputEditor.getValue(),
                language,
                newIndentation);
            return newIndentation;
        });
    };

    return (
        <div>
            <div className="language">
                <Typography noWrap variant='button' component="div" className='language-text'>Language</Typography>
                <FormControl sx={{width: '50%'}}>
                    <InputLabel id="language-select-label">Language</InputLabel>
                    <Select
                    labelId="language-select-label"
                    id="language-select"
                    value={language}
                    label="Language"
                    onChange={handleLanguageChange}
                    >
                        <MenuItem value={'db2'}>DB2</MenuItem>
                        <MenuItem value={'mariadb'}>MariaDB</MenuItem>
                        <MenuItem value={'mysql'}>MySQL</MenuItem>
                        <MenuItem value={'n1ql'}>Couchbase N1QL</MenuItem>
                        <MenuItem value={'plsql'}>Oracle PL/SQL</MenuItem>
                        <MenuItem value={'postgresql'}>PostgreSQL</MenuItem>
                        <MenuItem value={'redshift'}>Amazon Redshift</MenuItem>
                        <MenuItem value={'spark'}>Spark</MenuItem>
                        <MenuItem value={'sql'}>SQL</MenuItem>
                        <MenuItem value={'tsql'}>T-SQL</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="indentation">
                <Typography noWrap variant='button' component="div" className='indentation-text'>Indentation</Typography>
                <ToggleButtonGroup size="large" value={indentation} onChange={handleIndentationChange} exclusive={true}>
                    <ToggleButton value="four" key="four">Four Spaces</ToggleButton>
                    <ToggleButton value="two" key="two">Two Spaces</ToggleButton>
                    <ToggleButton value="tab" key="tab">Tab</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <InputOutputEditors 
                ref={editorRefs}
                onInputEditorChange={setOutputEditorText}
                getInputFileDialogFilters={() => fileDialogFilters}
                getOutputFileDialogFilters={() => fileDialogFilters}
                inputDefaultLanguage='sql'
                outputDefaultLanguage='sql'
                />
        </div>
    );
}

export default SqlFormatter