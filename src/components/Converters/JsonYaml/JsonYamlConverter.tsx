import React from 'react';
import './JsonYamlConverter.scss';
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
import YAML from 'yaml';

const fileDialogJsonFilters = [{ name: 'json files', extensions: ['txt', 'json'] }];
const fileDialogYamlFilters = [{ name: 'yaml files', extensions: ['txt', 'yaml', 'yml'] }];

function JsonYamlConverter() {
    let editorWidth = `calc(47vw - ${drawerWidth / 2}px)`;
    const editor1Ref: React.MutableRefObject<null | any> = React.useRef(null);
    const editor2Ref: React.MutableRefObject<null | any> = React.useRef(null);

    const [jsonToYaml, setJsonToYaml] = React.useState(true);

    const setResultEditorText = (value: string | undefined, j2y?: boolean) => {
        if (editor2Ref.current) {
            if (j2y ?? jsonToYaml) {
                try {
                    const json = JSON.parse(value ?? '');
                    editor2Ref.current.setValue(YAML.stringify(json));
                } catch(error: any) {
                    editor2Ref.current.setValue('Not a valid JSON!\n' + error.message);
                }
            } else {
                try {
                    const json = JSON.stringify(YAML.parse(value ?? ''));
                    editor2Ref.current.setValue(json);
                } catch(error: any) {
                    editor2Ref.current.setValue('Not a valid YAML!\n' + error.message);
                }            
            }
        }
    }

    const onSourceEditorChange = (value: string | undefined, event: any) => setResultEditorText(value);
    const onSourceEditorMount = (editor: any, monaco: any) => editor1Ref.current = editor;
    const onResultEditorMount = (editor: any, monaco: any) => editor2Ref.current = editor;

    const handleOperationChange = (event: React.MouseEvent<HTMLElement>, j2y: boolean) => {
        //j2y ? editor1Ref.current.language = 'json' : editor1Ref.current.language = 'yaml';
        setJsonToYaml(_ => {
            setResultEditorText(editor2Ref.current.getValue(), j2y);
            return j2y;
        });
    };

    const handlePaste = async () => {
        const clipboardText = await readText();
        editor1Ref.current.setValue(clipboardText);
    };
    const handleCopy = async () => await writeText(editor2Ref.current.getValue());
    const handleClear = () => editor1Ref.current.setValue('');
    const handleOpenFile = async() => {
        const path = await open({ directory: false, filters: jsonToYaml ? fileDialogJsonFilters : fileDialogYamlFilters, multiple: false });
        if (path) {
            const content = await readTextFile(path as string);
            editor1Ref.current.setValue(content);
        }    
    };
    const handleSave = async () => {
        const path = await save({filters: jsonToYaml ? fileDialogJsonFilters : fileDialogYamlFilters});
        await writeFile({contents: editor2Ref.current.getValue(), path: path});
    };

    return (
        <div>
            <div className="convert-buttons">
                <Typography noWrap variant='button' component="div" className='operation-text'>Operation</Typography>
                <ToggleButtonGroup size="large" value={jsonToYaml} onChange={handleOperationChange} exclusive={true}>
                    <ToggleButton value={true} key="j2y">JSON to YAML</ToggleButton>
                    <ToggleButton value={false} key="y2j">YAML to JSON</ToggleButton>
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
                    defaultLanguage="json"
                    onChange={onSourceEditorChange}
                    onMount={onSourceEditorMount}
                />
                <Editor
                    height="calc(90vh - 180px)"
                    width={editorWidth}
                    defaultLanguage="yaml"
                    options={{ readOnly: true }}
                    onMount={onResultEditorMount}
                />
            </div>
        </div>
    );
}

export default JsonYamlConverter