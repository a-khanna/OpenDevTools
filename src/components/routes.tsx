import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import JsonFormatter from './Formatters/JsonFormatter/JsonFormatter';
import XmlFormatter from './Formatters/XmlFormatter/XmlFormatter';
import HtmlEncoder from './Encoders/HtmlEncoder/html';
import JsonYamlConverter from './Converters/JsonYaml/JsonYamlConverter';

const AppRoutes = {
    converters: {
        sidebarTitle: "Converters",
        icon: <ChangeCircleOutlinedIcon />,
        path: "converter",
        children: [
            {
                sidebarTitle: "JSON <> YAML",
                pageTitle: "JSON <> YAML Converter",
                icon: <ChangeCircleOutlinedIcon />,
                path: 'jsonyaml',
                component: <JsonYamlConverter />
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
                icon: <ChangeCircleOutlinedIcon />,
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
                icon: <FormatIndentIncreaseIcon />,
                path: 'json',
                component: <JsonFormatter />
            },
            {
                sidebarTitle: "XML Formatter",
                pageTitle: "XML Formatter",
                icon: <FormatIndentIncreaseIcon />,
                path: 'xml',
                component: <XmlFormatter />
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