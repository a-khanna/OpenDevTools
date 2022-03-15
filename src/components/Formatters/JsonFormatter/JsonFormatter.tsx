import React from 'react';
import './JsonFormatter.scss';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import InputOutputEditors from '../../Common/InputOutputEditors';

const fileDialogFilters = [{ name: 'json files', extensions: ['txt', 'json'] }];
const formatJson = (input: string | undefined, indentation: string) => {
    let formattedText = input;
    try {
        let json = JSON.parse(input ?? '');
        switch (indentation) {
            case "four":
                formattedText = JSON.stringify(json, null, 4);
                break;
            case "two":
                formattedText = JSON.stringify(json, null, 2);
                break;
            case "tab":
                formattedText = JSON.stringify(json, null, "\t");
                break;
            default:
                formattedText = JSON.stringify(json);
                break;
        }
        return formattedText;
    } catch (error: any) {
        return 'Not a valid JSON!\n' + error.message;
    }
};

function JsonFormatter() {
    const editorRefs: React.MutableRefObject<any> = React.useRef();
    const [indentation, setIndentation] = React.useState('four');

    const setOutputEditorText = (outputEditor: any, value: string | undefined, ind?: string) => {
        if (outputEditor) {
            outputEditor.setValue(formatJson(value, ind ?? indentation));
        }
    }

    const handleIndentationChange = (event: React.MouseEvent<HTMLElement>, newIndentation: string) => {
        setIndentation(_ => {
            setOutputEditorText(editorRefs.current.outputEditor, editorRefs.current.outputEditor.getValue(), newIndentation);
            return newIndentation;
        });
    };

    return (
        <div>
            <div className="indentation">
                <Typography noWrap variant='button' component="div" className='indentation-text'>Indentation</Typography>
                <ToggleButtonGroup size="large" value={indentation} onChange={handleIndentationChange} exclusive={true}>
                    <ToggleButton value="four" key="four">Four Spaces</ToggleButton>
                    <ToggleButton value="two" key="two">Two Spaces</ToggleButton>
                    <ToggleButton value="tab" key="tab">Tab</ToggleButton>
                    <ToggleButton value="minify" key="minify">Minified</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <InputOutputEditors 
                ref={editorRefs}
                onInputEditorChange={setOutputEditorText}
                getInputFileDialogFilters={() => fileDialogFilters}
                getOutputFileDialogFilters={() => fileDialogFilters}
                inputDefaultLanguage='json'
                outputDefaultLanguage='json'
                inputDefaultValue='{}'
                outputDefaultValue='{}'
                />
        </div>
    );
}

export default JsonFormatter