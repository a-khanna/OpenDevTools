import React from 'react';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import InputOutputEditors from '../../Common/InputOutputEditors';
import formatter from 'xml-formatter';

const fileDialogFilters = [{ name: 'xml files', extensions: ['txt', 'xml'] }];
const formatXml = (input: string | undefined, indentation: string) => {
    let formattedText = input;
    try {
        switch (indentation) {
            case "four":
                formattedText = formatter(input ?? '', {indentation: '    ', lineSeparator: '\n'});
                break;
            case "two":
                formattedText = formatter(input ?? '', {indentation: '  ', lineSeparator: '\n'});
                break;
            case "tab":
                formattedText = formatter(input ?? '', {indentation: '\t', lineSeparator: '\n'});
                break;
            default:
                formattedText = formatter(input ?? '', {indentation: '', lineSeparator: ''});
                break;
        }
        return formattedText;
    } catch (error: any) {
        return 'Not a valid XML!\n' + error.message;
    }
};

function XmlFormatter() {
    const editorRefs: React.MutableRefObject<any> = React.useRef();
    const [indentation, setIndentation] = React.useState('four');

    const setOutputEditorText = (value: string | undefined, ind?: string) => {
        const outputEditor = editorRefs.current.outputEditor;
        if (outputEditor) {
            outputEditor.setValue(formatXml(value, ind ?? indentation));
        }
    }

    const handleIndentationChange = (event: React.MouseEvent<HTMLElement>, newIndentation: string) => {
        setIndentation(_ => {
            setOutputEditorText(editorRefs.current.outputEditor.getValue(), newIndentation);
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
                inputDefaultLanguage='xml'
                outputDefaultLanguage='xml'
                />
        </div>
    );
}

export default XmlFormatter