import React, { useEffect } from 'react';
import './JsonYamlConverter.scss';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import YAML from 'yaml';
import InputOutputEditors from '../../Common/InputOutputEditors';

const fileDialogJsonFilters = [{ name: 'json files', extensions: ['txt', 'json'] }];
const fileDialogYamlFilters = [{ name: 'yaml files', extensions: ['txt', 'yaml', 'yml'] }];
const LOCALSTORAGE_KEY = 'JsonYamlConverterText';

function JsonYamlConverter() {
    const editorRefs: React.MutableRefObject<any> = React.useRef();
    const [jsonToYaml, setJsonToYaml] = React.useState(true);

    const setOutputEditorText = (outputEditor: any, value: string | undefined, j2y?: boolean) => {
        if (outputEditor) {
            localStorage.setItem(LOCALSTORAGE_KEY, value ?? '');

            if (j2y ?? jsonToYaml) {
                try {
                    const result = YAML.stringify(JSON.parse(value ?? ''));                
                    outputEditor.setValue(result);
                } catch(error: any) {
                    outputEditor.setValue('Not a valid JSON!\n' + error.message);
                }
            } else {
                try {
                    const result = JSON.stringify(YAML.parse(value ?? ''));
                    outputEditor.setValue(result);
                } catch(error: any) {
                    outputEditor.setValue('Not a valid YAML!\n' + error.message);
                }            
            }
        }
    }

    const handleOperationChange = (event: React.MouseEvent<HTMLElement>, j2y: boolean) => {
        setJsonToYaml(_ => {
            setOutputEditorText(editorRefs.current.outputEditor, editorRefs.current.outputEditor.getValue(), j2y);
            return j2y;
        });
    };

    useEffect(() => {
        // do conversion on component load
        setTimeout(() => {
            setOutputEditorText(editorRefs.current.outputEditor, editorRefs.current.inputEditor.getValue());
        }, 500);
    }, []);

    return (
        <div>
            <div className="convert-buttons">
                <Typography noWrap variant='button' component="div" className='operation-text'>Operation</Typography>
                <ToggleButtonGroup size="large" value={jsonToYaml} onChange={handleOperationChange} exclusive={true}>
                    <ToggleButton value={true} key="j2y">JSON to YAML</ToggleButton>
                    <ToggleButton value={false} key="y2j">YAML to JSON</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <InputOutputEditors 
                ref={editorRefs}
                onInputEditorChange={setOutputEditorText}
                getInputFileDialogFilters={() => jsonToYaml ? fileDialogJsonFilters : fileDialogYamlFilters}
                getOutputFileDialogFilters={() => jsonToYaml ? fileDialogYamlFilters : fileDialogJsonFilters}
                inputDefaultLanguage='json'
                outputDefaultLanguage='yaml'
                inputDefaultValue={localStorage.getItem(LOCALSTORAGE_KEY) ? localStorage.getItem(LOCALSTORAGE_KEY) : '{}'}
                />
        </div>
    );
}

export default JsonYamlConverter