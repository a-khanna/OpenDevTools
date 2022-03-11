import React from 'react'
import { drawerWidth } from '../../global';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { Routes, Route, Link, useLocation } from "react-router-dom";
import JsonFormatter from '../Formatters/JsonFormatter/JsonFormatter';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import { AppRoutes, FlatRoutes } from '../routes';

const menuGroups = Object.keys(AppRoutes);
const flatRoutes = FlatRoutes();

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function App() {

    const theme = useTheme();
    const location = useLocation();
    const activeTitle = flatRoutes.find(r => location.pathname.includes(r.path))?.pageTitle ?? 'JSON Formatter';

    const [groupToggle, setGroupToggle] = React.useState(() => {
        const state = {};
        for (let group of menuGroups)
            (state as any)[group] = true;
        return state;
    });
    const [drawerOpen, setDrawerOpen] = React.useState(true);
    const [searchItems, setSearchItems] = React.useState<{sidebarTitle: string, icon: any, path: string, component: any}[]>([]);

    const handleGroupToggle = (group: string) => {
        setGroupToggle((state) => ({ ...state, [group]: !(state as any)[group] }));
    };

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const onSearchChange = (event: any) => {
        if (!(event.target.value && event.target.value.trim())) {
            setSearchItems(_ => []);
            return;
        }
        setSearchItems(_ => flatRoutes.filter(r => r.sidebarTitle.toLowerCase().includes(event.target.value.trim().toLowerCase())));
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={drawerOpen}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {activeTitle}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={drawerOpen}
            >
                <DrawerHeader>
                    <TextField id="tf-search-tool" label="Search" variant="standard" onChange={onSearchChange} sx={{ width: '100%' }} />
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />

                <List>
                    {searchItems.length
                        ? searchItems.map((item) => (
                            <ListItem button key={item.sidebarTitle}
                                component={Link}
                                to={item.path}
                                style={{ color: 'inherit' }}>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.sidebarTitle} />
                            </ListItem>
                        ))
                        : menuGroups.map((group) => (
                            <div key={group}>
                                <ListItem button onClick={() => handleGroupToggle(group)}>
                                    <ListItemIcon>
                                        {(AppRoutes as any)[group].icon}
                                    </ListItemIcon>
                                    <ListItemText primary={(AppRoutes as any)[group].sidebarTitle} />
                                    {(groupToggle as any)[group] ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={(groupToggle as any)[group]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {(AppRoutes as any)[group].children.map((item: any) => (
                                            <ListItem button key={item.sidebarTitle}
                                                sx={{ pl: 4 }} component={Link}
                                                to={(AppRoutes as any)[group].path + '/' + item.path}
                                                style={{ color: 'inherit' }}>
                                                <ListItemIcon>
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText primary={item.sidebarTitle} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </div>
                    ))}
                </List>
            </Drawer>
            <Main open={drawerOpen}>
                <DrawerHeader />
                <Routes>
                    <Route path="/" element={<JsonFormatter />} />
                    {flatRoutes.map(route => (<Route key={route.path} path={route.path} element={route.component} />))}
                </Routes>
            </Main>
        </Box>
    );
}

export default App
