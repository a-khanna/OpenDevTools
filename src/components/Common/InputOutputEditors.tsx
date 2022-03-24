import React from 'react';
import './InputOutputEditors.scss';
import { drawerWidth } from '../../global';
import Editor from "@monaco-editor/react";
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { readText, writeText } from '@tauri-apps/api/clipboard';
import { open, save } from '@tauri-apps/api/dialog';
import { readTextFile, writeFile } from '@tauri-apps/api/fs';
import PropTypes from 'prop-types';
import ContentCopyIcon from '../../icons/ContentCopyIcon';
import ContentPasteIcon from '../../icons/ContentPasteIcon';
import UploadFileIcon from '../../icons/UploadFileIcon';
import SaveAltIcon from '../../icons/SaveAltIcon';
import ClearIcon from '../../icons/ClearIcon';

let editorWidth = `calc(47vw - ${drawerWidth / 2}px)`;

const InputOutputEditors = React.forwardRef((props: any, ref: any) => {

    const inputEditorRef: React.MutableRefObject<any> = React.useRef();
    const outputEditorRef: React.MutableRefObject<any> = React.useRef();
    React.useImperativeHandle(ref, () => ({
        get inputEditor() {
            return inputEditorRef.current;
        },
        get outputEditor() {
            return outputEditorRef.current;
        }
    }));

    const onInputEditorChange = (value: string | undefined, event: any) => props.onInputEditorChange(outputEditorRef.current, value);
    const onInputEditorMount = (editor: any, monaco: any) => inputEditorRef.current = editor;
    const onOutputEditorMount = (editor: any, monaco: any) => outputEditorRef.current = editor;

    const handlePaste = async () => {
        const clipboardText = await readText();
        inputEditorRef.current.setValue(clipboardText);
    };
    const handleCopy = async () => await writeText(outputEditorRef.current.getValue());
    const handleClear = () => inputEditorRef.current.setValue(props.inputDefaultValue);
    const handleOpenFile = async() => {
        const path = await open({ directory: false, filters: props.getInputFileDialogFilters(), multiple: false });
        if (path) {
            const content = await readTextFile(path as string);
            inputEditorRef.current.setValue(content);
        }    
    };
    const handleSave = async () => {
        const path = await save({filters: props.getOutputFileDialogFilters()});
        if (path)
            await writeFile({contents: outputEditorRef.current.getValue(), path: path});
    };

    return (
        <div>
            <div className="labels-and-buttons">
                <div className="lb-group">
                    <Typography className="lb-label" noWrap variant='button' component="div">Input</Typography>
                    <Tooltip title="Paste"><IconButton color="inherit" onClick={handlePaste}><ContentPasteIcon /></IconButton></Tooltip>
                    <Tooltip title="Open file"><IconButton color="inherit" onClick={handleOpenFile}><UploadFileIcon /></IconButton></Tooltip>
                    <Tooltip title="Clear"><IconButton color="inherit" onClick={handleClear}><ClearIcon /></IconButton></Tooltip>
                </div>
                <div className="lb-group">
                    <Typography className="lb-label" noWrap variant='button' component="div">Output</Typography>
                    <Tooltip title="Copy"><IconButton color="inherit" onClick={handleCopy}><ContentCopyIcon /></IconButton></Tooltip>
                    <Tooltip title="Save As"><IconButton color="inherit" onClick={handleSave}><SaveAltIcon /></IconButton></Tooltip>
                </div>
            </div>

            <div className='editor-wrapper'>
                <Editor
                    height="calc(90vh - 180px)"
                    width={editorWidth}
                    className="editor"
                    defaultLanguage={props.inputDefaultLanguage}
                    defaultValue={props.inputDefaultValue}
                    onChange={onInputEditorChange}
                    onMount={onInputEditorMount}
                />
                <Editor
                    height="calc(90vh - 180px)"
                    width={editorWidth}
                    className="editor"
                    defaultLanguage={props.outputDefaultLanguage}
                    defaultValue={props.outputDefaultValue}
                    options={{ readOnly: true }}
                    onMount={onOutputEditorMount}
                />
            </div>
        </div>
    );
});

InputOutputEditors.propTypes = {
    onInputEditorChange: PropTypes.func.isRequired,
    getInputFileDialogFilters: PropTypes.func.isRequired,
    getOutputFileDialogFilters: PropTypes.func.isRequired,
    inputDefaultLanguage: PropTypes.string.isRequired,
    outputDefaultLanguage: PropTypes.string.isRequired,
    inputDefaultValue: PropTypes.string,
    outputDefaultValue: PropTypes.string,
};

InputOutputEditors.defaultProps = {
    inputDefaultValue: '',
    outputDefaultValue: '',
};

export default InputOutputEditors