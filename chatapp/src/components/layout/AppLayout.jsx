
import { Drawer, Grid, Skeleton } from '@mui/material'
import React, { use, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getSocket } from '../../../socket.jsx'
import { NEW_MESSAGE, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../../constants/events.js'
import { useErrors, useSocketEvents } from '../../hooks/hook.jsx'
import { getOrSaveFromStorage } from '../../lib/features.js'
import { useMyChatsQuery } from '../../redux/api/api.js'
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat.js'
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from '../../redux/reducers/misc.js'
import DeleteChatMenu from '../dialogs/DeleteChatMenu.jsx'
import Title from '../shared/Title.jsx'
import ChatList from '../specific/ChatList.jsx'
import Profile from '../specific/Profile.jsx'
import Header from './Header'


 
const AppLayout = () =>(WrappedComponent)=> {
return (props) => {
    const params= useParams();
    const chatId= params.chatId;
    const dispatch = useDispatch();
    const socket = getSocket();
    const deleteMenuAnchor = useRef(null);

  //  console.log(socket.id)

    const {isMobile}= useSelector((state) => state.misc);
    const {user}= useSelector((state) => state.auth);
    const {newMessagesAlert}= useSelector((state) => state.chat);
    const {isLoading,data,isError,error,refetch}=useMyChatsQuery("");
    const [onlineUsers, setOnlineUsers]= useState([]);
    const navigate = useNavigate();
    // console.log(data)
    useErrors([{ isError, error }]);

    useEffect(()=>{
        getOrSaveFromStorage({key:NEW_MESSAGE, value: newMessagesAlert })
    },[newMessagesAlert])

    const handleMobileClose=()=> dispatch(setIsMobile(false));

    const handleDeleteChat = (e, chatId, groupChat) => {
        dispatch(setIsDeleteMenu(true));
        dispatch(setSelectedDeleteChat({ chatId, groupChat }));
        deleteMenuAnchor.current = e.currentTarget;
    }
    
    const newMessageAlertHandler = useCallback((data)=>{
        if(data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
    },[chatId]);

    const newRequestHandler = useCallback(()=>{
        dispatch(incrementNotification())
    },[dispatch]);

    const refetchListener = useCallback(()=>{
        refetch();
        navigate("/");
    },[refetch, navigate]);  

    const onlineUserListener = useCallback((data) => {
       //console.log(data)
       setOnlineUsers(data);
      }, [])


   const eventHandlers = {
       [NEW_MESSAGE]: newMessageAlertHandler,
       [NEW_REQUEST]: newRequestHandler,
       [REFETCH_CHATS]: refetchListener,
       [ONLINE_USERS]: onlineUserListener,
     };
     
     useSocketEvents(socket, eventHandlers);

    return (
        <>
            <Title />
            <Header />

            <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor}/>

            {
                isLoading ? (
                <Skeleton/>
            ):(
                <Drawer  open={isMobile} onClose={handleMobileClose} >
                    <ChatList 
                    w="70vw"
                    chats={data?.chats} 
                    chatId={chatId} 
                    handleDeleteChat={handleDeleteChat}
                    newMessagesAlert={newMessagesAlert}
                    onlineUsers={onlineUsers}
                   /> 
                </Drawer>
            )
            }
            <Grid container height={"calc(100vh - 4rem)"}>
                <Grid
                    item
                    sm={4}
                    md={3}
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                    }}
                    height={"100%"}
                >
                    {
                        isLoading ? (<Skeleton/>):
                        (
                            <ChatList 
                            chats={data?.chats} 
                            chatId={chatId} 
                            handleDeleteChat={handleDeleteChat}
                            newMessagesAlert={newMessagesAlert}
                            onlineUsers={onlineUsers}
                           />
                        )
                    }
                </Grid>
                <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"} bgcolor={"#f9f9f9"}>
                    <WrappedComponent {...props} chatId={chatId} user={user}/>
                </Grid>
                <Grid item md={4} lg={3} height={"100%"}
                sx={{
                    display: { xs: 'none', md: 'block' },
                    padding: "2rem",
                    bgcolor: "rgba(0,0,0,0.9)",
                }}>
                    <Profile user={user} />
                    </Grid>
            </Grid>
        </>
    );
};
}

export default AppLayout
