import { MdFormatIndentIncrease, MdOutlineChangeCircle, MdSpaceBar } from 'react-icons/md';
import { CgArrowsExchange, CgHashtag } from 'react-icons/cg';
import { VscJson, VscCode } from 'react-icons/vsc';
import { AiOutlineHtml5, AiOutlineConsoleSql } from 'react-icons/ai';
import JsonFormatter from './Formatters/JsonFormatter/JsonFormatter';
import XmlFormatter from './Formatters/XmlFormatter/XmlFormatter';
import HtmlEncoder from './Encoders/HtmlEncoder/html';
import JsonYamlConverter from './Converters/JsonYaml/JsonYamlConverter';
import BaseConverter from './Converters/BaseConverter/BaseConverter';
import SqlFormatter from './Formatters/SQLFormatter/SQLFormatter';

const AppRoutes = {
    converters: {
        sidebarTitle: "Converters",
        icon: <CgArrowsExchange />,
        path: "converter",
        children: [
            {
                sidebarTitle: "JSON <> YAML",
                pageTitle: "JSON <> YAML Converter",
                icon: <div><VscJson /><MdSpaceBar /></div>,
                path: 'jsonyaml',
                component: <JsonYamlConverter />
            },
            {
                sidebarTitle: "Base Converter",
                pageTitle: "Base Converter",
                icon: <CgHashtag />,
                path: 'base',
                component: <BaseConverter />
            }
        ]
    },
    encoders: {
        sidebarTitle: "Encoders / Decoders",
        icon: <MdOutlineChangeCircle />,
        path: "encoder",
        children: [
            {
                sidebarTitle: "HTML",
                pageTitle: "HTML Encoder",
                icon: <AiOutlineHtml5 />,
                path: 'html',
                component: <HtmlEncoder />
            }
        ]
    },
    formatters: {
        sidebarTitle: "Formatters",
        icon: <MdFormatIndentIncrease />,
        path: "formatter",
        children: [
            {
                sidebarTitle: "JSON Formatter",
                pageTitle: "JSON Formatter",
                icon: <VscJson />,
                path: 'json',
                component: <JsonFormatter />
            },
            {
                sidebarTitle: "XML Formatter",
                pageTitle: "XML Formatter",
                icon: <VscCode />,
                path: 'xml',
                component: <XmlFormatter />
            },
            {
                sidebarTitle: "SQL Formatter",
                pageTitle: "SQL Formatter",
                icon: <AiOutlineConsoleSql />,
                path: 'sql',
                component: <SqlFormatter />
            }
        ]
    }
};

const FlatRoutes = () => {
    const result = [];
    const keys = Object.keys(AppRoutes);
    for (let key of keys) {
        for (let child of (AppRoutes as any)[key].children) {
            let item = {...child};
            item.path = (AppRoutes as any)[key].path + '/' + item.path;
            result.push(item);
        }
    }
    return result;
};

export { AppRoutes, FlatRoutes }