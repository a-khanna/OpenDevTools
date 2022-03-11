import React from 'react';
import './html.scss';
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
import {encode, decode} from 'html-entities';

const fileDialogFilters = [{ name: 'html files', extensions: ['txt', 'html'] }];

function HtmlEncoder() {
    let editorWidth = `calc(47vw - ${drawerWidth / 2}px)`;
    const editor1Ref: React.MutableRefObject<null | any> = React.useRef(null);
    const editor2Ref: React.MutableRefObject<null | any> = React.useRef(null);

    const [encodeEnabled, setEncodeEnabled] = React.useState(true);

    const setResultEditorText = (value: string | undefined, enc?: boolean) => {
        if (editor2Ref.current) {
            if (enc ?? encodeEnabled)
                editor2Ref.current.setValue(encode(value));
            else
                editor2Ref.current.setValue(decode(value));
        }
    }

    const onSourceEditorChange = (value: string | undefined, event: any) => setResultEditorText(value);
    const onSourceEditorMount = (editor: any, monaco: any) => editor1Ref.current = editor;
    const onResultEditorMount = (editor: any, monaco: any) => editor2Ref.current = editor;

    const handleOperationChange = (event: React.MouseEvent<HTMLElement>, enc: boolean) => {
        // if (enc) {
        //     editor1Ref.current.setModelLanguage(editor1Ref.current.getModel(), 'html');
        //     editor2Ref.current.setModelLanguage(editor2Ref.current.getModel(), 'plaintext');
        // } else {
        //     editor2Ref.current.setModelLanguage(editor2Ref.current.getModel(), 'html');
        //     editor1Ref.current.setModelLanguage(editor1Ref.current.getModel(), 'plaintext');
        // }
        console.log(editor1Ref.current.getModel());
        setEncodeEnabled(_ => {
            setResultEditorText(editor2Ref.current.getValue(), enc);
            return enc;
        });
    };

    const handlePaste = async () => {
        const clipboardText = await readText();
        editor1Ref.current.setValue(clipboardText);
    };
    const handleCopy = async () => await writeText(editor2Ref.current.getValue());
    const handleClear = () => editor1Ref.current.setValue('');
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
            <div className="encode-buttons">
                <Typography noWrap variant='button' component="div" className='operation-text'>Operation</Typography>
                <ToggleButtonGroup size="large" value={encodeEnabled} onChange={handleOperationChange} exclusive={true}>
                    <ToggleButton value={true} key="encode">Encode</ToggleButton>
                    <ToggleButton value={false} key="decode">Decode</ToggleButton>
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
                    defaultLanguage="html"
                    onChange={onSourceEditorChange}
                    onMount={onSourceEditorMount}
                />
                <Editor
                    height="calc(90vh - 180px)"
                    width={editorWidth}
                    defaultLanguage="plaintext"
                    options={{ readOnly: true }}
                    onMount={onResultEditorMount}
                />
            </div>
        </div>
    );
}

export default HtmlEncoder