import React from 'react'
import { drawerWidth } from '../../../global';
import Editor from "@monaco-editor/react";

function XmlFormatter() {
    let editorWidth = `calc(47vw - ${drawerWidth / 2}px)`;
    const editor2Ref: React.MutableRefObject<null | any> = React.useRef(null);

    const onSourceEditorChange = (value: string | undefined, event: any) => {
        if (editor2Ref.current) {
            let formattedText = value;
            var xmlDoc = new DOMParser().parseFromString(value ?? '', 'application/xml');
            var xsltDoc = new DOMParser().parseFromString([
                // describes how we want to modify the XML - indent everything
                '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
                '  <xsl:strip-space elements="*"/>',
                '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
                '    <xsl:value-of select="normalize-space(.)"/>',
                '  </xsl:template>',
                '  <xsl:template match="node()|@*">',
                '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
                '  </xsl:template>',
                '  <xsl:output indent="yes"/>',
                '</xsl:stylesheet>',
            ].join('\n'), 'application/xml');

            var xsltProcessor = new XSLTProcessor();    
            xsltProcessor.importStylesheet(xsltDoc);
            var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
            formattedText = new XMLSerializer().serializeToString(resultDoc);
            editor2Ref.current.setValue(formattedText);
        }
    };
    const onResultEditorMount = (editor: any, monaco: any) => {
        editor2Ref.current = editor;
    };

    return (
        <div className='editor-wrapper'>
            <Editor
                height="calc(90vh - 180px)"
                width={editorWidth}
                defaultLanguage="xml"
                onChange={onSourceEditorChange}
            />
            <Editor
                height="calc(90vh - 180px)"
                width={editorWidth}
                defaultLanguage="xml"
                options={{ readOnly: true }}
                onMount={onResultEditorMount}
            />
        </div>
    );
}

export default XmlFormatter