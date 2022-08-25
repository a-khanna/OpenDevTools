import React from 'react';
import './html.scss';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {encode, decode} from 'html-entities';
import InputOutputEditors from '../../Common/InputOutputEditors';

const fileDialogFilters = [{ name: 'html files', extensions: ['txt', 'html'] }];

function HtmlEncoder() {
    const editorRefs: React.MutableRefObject<any> = React.useRef();
    const [encodeEnabled, setEncodeEnabled] = React.useState(true);

    const setOutputEditorText = (value: string | undefined, enc?: boolean) => {
        const outputEditor = editorRefs.current.outputEditor;
        if (outputEditor) {
            if (enc ?? encodeEnabled)
                outputEditor.setValue(encode(value));
            else
                outputEditor.setValue(decode(value));
        }
    }

    const handleOperationChange = (event: React.MouseEvent<HTMLElement>, enc: boolean) => {
        setEncodeEnabled(_ => {
            editorRefs.current.switchModels();
            return enc;
        });
    };

    return (
        <div>
            <div className="encode-buttons">
                <Typography noWrap variant='button' component="div" className='operation-text'>Operation</Typography>
                <ToggleButtonGroup size="large" value={encodeEnabled} onChange={handleOperationChange} exclusive={true}>
                    <ToggleButton value={true} key="encode">Encode</ToggleButton>
                    <ToggleButton value={false} key="decode">Decode</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <InputOutputEditors 
                ref={editorRefs}
                onInputEditorChange={setOutputEditorText}
                getInputFileDialogFilters={() => fileDialogFilters}
                getOutputFileDialogFilters={() => fileDialogFilters}
                inputDefaultLanguage='html'
                outputDefaultLanguage='plaintext'
                />
        </div>
    );
}

export default HtmlEncoder