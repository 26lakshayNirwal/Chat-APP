import { Avatar, Box, Drawer, Grid, IconButton, Stack, Typography } from '@mui/material'
import React, { use, useState } from 'react'
import { grayColor } from '../../constants/color'
import { Close as CloseIcon, ExitToApp as ExitToAppIcon, Groups as GroupsIcon, ManageAccounts as ManageAccountsIcon, Menu as MenuIcon, Message as MessageIcon } from '@mui/icons-material'
import { Navigate, useLocation } from 'react-router-dom'
import { Dashboard as DashboardIcon } from '@mui/icons-material'
import { Link } from '../styles/styledComponent'
import { useDispatch, useSelector } from 'react-redux'
import { adminLogout } from '../../redux/reducers/thunks/admin'

const adminTab = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <DashboardIcon />
    },
    {
        name: "Users",
        path: "/admin/users-management",
        icon: <ManageAccountsIcon />
    },
    {
        name: "Chats",
        path: "/admin/chats-management",
        icon: <GroupsIcon />
    },
    {
        name: "Messages",
        path: "/admin/messages-management",
        icon: <MessageIcon />
    },
]

const SideBar = ({ w = "100%" }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const logoutHandler = () => {
        dispatch(adminLogout());
    }
    return (
        <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
            <Typography variant='h5' textTransform={"uppercase"}>
                hello
            </Typography>

            <Stack spacing={"1rem"}>
                {adminTab.map((tab) => (
                    <Link key={tab.path} to={tab.path}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            padding: "0.75rem",
                            borderRadius: "1rem",
                            transition: "0.3s",
                            ...(location.pathname === tab.path && {
                                bgcolor: "black",
                                color: "white",
                                ":hover": { bgcolor: "gray", color: "white" },
                            })
                        }}
                    >
                        <Avatar sx={{ bgcolor: "black", color: "white", width: 36, height: 36 }}>
                            {tab.icon}
                        </Avatar>
                        <Typography>{tab.name}</Typography>
                    </Link>
                ))}

                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={"1rem"}
                    sx={{
                        padding: "0.75rem",
                        borderRadius: "1rem",
                        cursor: "pointer",
                        transition: "0.3s",
                        ":hover": { bgcolor: "gray", color: "white" },
                    }}
                    onClick={logoutHandler}
                >
                    <Avatar sx={{ bgcolor: "black", color: "white", width: 36, height: 36 }}>
                        <ExitToAppIcon />
                    </Avatar>
                    <Typography>Logout</Typography>
                </Stack>
            </Stack>
        </Stack>
    );
}



const AdminLayout = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);
    const {isAdmin}= useSelector((state)=>state.auth);

    const handleMobile = () => {
        setIsMobile(!isMobile);
    }

    const handleClose = () => {
        setIsMobile(false);
    }

    if(!isAdmin) return <Navigate to="/admin"/>

    return (
        <Grid container minHeight={"100vh"}>
            <Box
                sx={{
                    display: { xs: "block", md: "none" },
                    position: "fixed",
                    right: "1rem",
                    top: "1rem",
                }}>
                <IconButton onClick={handleMobile}>
                    {isMobile ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
            </Box>

            <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
                <SideBar />
            </Grid>

            <Grid
                item
                xs={12}
                md={8}
                lg={9}
                sx={{ bgcolor: grayColor }}
            >
                {children}
            </Grid>

            <Drawer open={isMobile} onClose={handleClose}>
                <SideBar w="50vw" />
            </Drawer>
        </Grid>
    )
}

export default AdminLayout;
