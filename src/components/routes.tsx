import JsonFormatter from './Formatters/JsonFormatter/JsonFormatter';
import XmlFormatter from './Formatters/XmlFormatter/XmlFormatter';
import HtmlEncoder from './Encoders/HtmlEncoder/html';
import JsonYamlConverter from './Converters/JsonYaml/JsonYamlConverter';
import BaseConverter from './Converters/BaseConverter/BaseConverter';
import SqlFormatter from './Formatters/SQLFormatter/SQLFormatter';
import FormatIndentIncreaseIcon from '../icons/FormatIndentIncreaseIcon';
import ChangeCircleOutlinedIcon from '../icons/ChangeCircleOutlinedIcon';
import ArrowExchangeIcon from '../icons/ArrowExchangeIcon';
import HashtagIcon from '../icons/HashtagIcon';
import SpaceBarIcon from '../icons/SpaceBarIcon';
import JsonIcon from '../icons/JsonIcon';
import CodeIcon from '../icons/CodeIcon';
import OutlineHtml5Icon from '../icons/OutlineHtml5Icon';
import OutlineConsoleSqlIcon from '../icons/OutlineConsoleSqlIcon';

const AppRoutes = {
    converters: {
        sidebarTitle: "Converters",
        icon: <ArrowExchangeIcon />,
        path: "converter",
        children: [
            {
                sidebarTitle: "JSON <> YAML",
                pageTitle: "JSON <> YAML Converter",
                icon: <div><JsonIcon /><SpaceBarIcon /></div>,
                path: 'jsonyaml',
                component: <JsonYamlConverter />
            },
            {
                sidebarTitle: "Base Converter",
                pageTitle: "Base Converter",
                icon: <HashtagIcon />,
                path: 'base',
                component: <BaseConverter />
            }
        ]
    },
    encoders: {
        sidebarTitle: "Encoders / Decoders",
        icon: <ChangeCircleOutlinedIcon />,
        path: "encoder",
        children: [
            {
                sidebarTitle: "HTML",
                pageTitle: "HTML Encoder",
                icon: <OutlineHtml5Icon />,
                path: 'html',
                component: <HtmlEncoder />
            }
        ]
    },
    formatters: {
        sidebarTitle: "Formatters",
        icon: <FormatIndentIncreaseIcon />,
        path: "formatter",
        children: [
            {
                sidebarTitle: "JSON Formatter",
                pageTitle: "JSON Formatter",
                icon: <JsonIcon />,
                path: 'json',
                component: <JsonFormatter />
            },
            {
                sidebarTitle: "XML Formatter",
                pageTitle: "XML Formatter",
                icon: <CodeIcon />,
                path: 'xml',
                component: <XmlFormatter />
            },
            {
                sidebarTitle: "SQL Formatter",
                pageTitle: "SQL Formatter",
                icon: <OutlineConsoleSqlIcon />,
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