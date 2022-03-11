import React from 'react';
import './JsonFormatter.scss';
import { drawerWidth } from '../../../global';
import Editor from "@monaco-editor/react";
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import IconButton from '@mui/material/IconButton';
import ContentPaste from '@mui/icons-material/ContentPaste';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import FileOpenOutlined from '@mui/icons-material/FileOpenOutlined';
import SaveAsOutlined from '@mui/icons-material/SaveAsOutlined';
import Clear from '@mui/icons-material/Clear';
import { readText, writeText } from '@tauri-apps/api/clipboard';
import { open, save } from '@tauri-apps/api/dialog';
import { readTextFile, writeFile } from '@tauri-apps/api/fs';

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
    let editorWidth = `calc(47vw - ${drawerWidth / 2}px)`;
    const editor1Ref: React.MutableRefObject<null | any> = React.useRef(null);
    const editor2Ref: React.MutableRefObject<null | any> = React.useRef(null);

    const [indentation, setIndentation] = React.useState('four');

    const setResultEditorText = (value: string | undefined, ind?: string) => {
        if (editor2Ref.current) {
            editor2Ref.current.setValue(formatJson(value, ind ?? indentation));
        }
    }

    const onSourceEditorChange = (value: string | undefined, event: any) => setResultEditorText(value);
    const onSourceEditorMount = (editor: any, monaco: any) => editor1Ref.current = editor;
    const onResultEditorMount = (editor: any, monaco: any) => editor2Ref.current = editor;

    const handleIndentationChange = (event: React.MouseEvent<HTMLElement>, newIndentation: string) => {
        setIndentation(_ => {
            setResultEditorText(editor2Ref.current.getValue(), newIndentation);
            return newIndentation;
        });
    };

    const handlePaste = async () => {
        const clipboardText = await readText();
        editor1Ref.current.setValue(clipboardText);
    };
    const handleCopy = async () => await writeText(editor2Ref.current.getValue());
    const handleClear = () => editor1Ref.current.setValue('{}');
    const handleOpenFile = async() => {
        const path = await open({ directory: false, filters: fileDialogFilters, multiple: false });
        if (path) {
            const content = await readTextFile(path as string);
            editor1Ref.current.setValue(content);
        }    
    };
    const handleSave = async () => {
        const path = await save({filters: fileDialogFilters});
        await writeFile({contents: editor2Ref.current.getValue(), path: path});
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
            <div className="labels-and-buttons">
                <div className="lb-group">
                    <Typography className="lb-label" noWrap variant='button' component="div">Input</Typography>
                    <Tooltip title="Paste"><IconButton color="inherit" onClick={handlePaste}><ContentPaste /></IconButton></Tooltip>
                    <Tooltip title="Open file"><IconButton color="inherit" onClick={handleOpenFile}><FileOpenOutlined /></IconButton></Tooltip>
                    <Tooltip title="Clear"><IconButton color="inherit" onClick={handleClear}><Clear /></IconButton></Tooltip>
                </div>
                <div className="lb-group">
                    <Typography className="lb-label" noWrap variant='button' component="div">Output</Typography>
                    <Tooltip title="Copy"><IconButton color="inherit" onClick={handleCopy}><ContentCopy /></IconButton></Tooltip>
                    <Tooltip title="Save As"><IconButton color="inherit" onClick={handleSave}><SaveAsOutlined /></IconButton></Tooltip>
                </div>
            </div>

            <div className='editor-wrapper'>
                <Editor
                    height="calc(90vh - 180px)"
                    width={editorWidth}
                    className="editor"
                    defaultLanguage="json"
                    defaultValue="{}"
                    onChange={onSourceEditorChange}
                    onMount={onSourceEditorMount}
                />
                <Editor
                    height="calc(90vh - 180px)"
                    width={editorWidth}
                    className="editor"
                    defaultLanguage="json"
                    defaultValue="{}"
                    options={{ readOnly: true }}
                    onMount={onResultEditorMount}
                />
            </div>
        </div>
    );
}

export default JsonFormatter