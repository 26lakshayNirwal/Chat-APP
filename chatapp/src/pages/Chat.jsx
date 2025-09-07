import { useInfiniteScrollTop } from '6pp'
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material'
import { IconButton, Skeleton, Stack } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getSocket } from '../../socket'
import FileMenu from '../components/dialogs/FileMenu'
import AppLayout from '../components/layout/AppLayout'
import { TypingLoader } from '../components/layout/Loaders.jsx'
import MessageComponent from '../components/shared/MessageComponent'
import { InputBox } from '../components/styles/styledComponent'
import { grayColor, Orange } from '../constants/color'
import { ALERT, CHAT_JOINED, CHAT_LEFT, NEW_MESSAGE_ALERT, START_TYPING, STOP_TYPING } from '../constants/events.js'
import { useErrors, useSocketEvents } from '../hooks/hook.jsx'
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api.js'
import { removeNewMessagesAlert } from '../redux/reducers/chat.js'
import { setIsFileMenu } from '../redux/reducers/misc.js'



const Chat = ({chatId,user}) => {

  const conatainerRef = useRef(null)
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [userTyping, setUserTyping] = useState(false);
  const [IamTyping, setIamTyping] = useState(false);
  const typingTimeout = useRef(null);
  const bottomRef = useRef(null);

 const chatDetails= useChatDetailsQuery({chatId, skip: !chatId})

 //console.log("chatId used:", chatId);
 //console.log("Calling useGetMessagesQuery with chatId:", chatId, "and page:", page);


 const oldMessagesChunk = useGetMessagesQuery({chatId, page ,skip: !chatId});

  const {data: oldMessages , setData: setOldMessages}= useInfiniteScrollTop(
    conatainerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages,
  )

  const members = chatDetails?.data?.chat?.members;

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault()
    if(!message.trim())return ;

    socket.emit(NEW_MESSAGE_ALERT,{chatId, members, message});
    setMessage("");
  };

  useEffect(() => {

    socket.emit(CHAT_JOINED,{userId: user._id,members});
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEFT,{userId: user._id,members});

    }
  },[chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if(chatDetails.isError)return navigate("/");
  },[chatDetails.isError]);

  const newMessagesListener = useCallback((data)=>{
    if(data.chatId !== chatId) return;
    setMessages((prev)=>[...prev, data.message]);
  },[chatId]);

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
      
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandlers = {
    [ALERT]: alertListener,
    [NEW_MESSAGE_ALERT]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };
  
  useSocketEvents(socket, eventHandlers);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  
  
  return chatDetails.isLoading ? (
    <Skeleton/>
  ) : (
    <>
    <Stack
     ref={conatainerRef}
     boxSizing={"border-box"}
      padding={"1rem"}
      spacing={"1rem"}
      bgcolor={grayColor}
      height={"90%"}
      sx={{
        overflowX:"hidden",
        overflowY:"auto"

      }}
    >
      
      {
        allMessages.map((i)=>(
          <MessageComponent  key={i._id} message={i} user={user}/>
        ))
      }


      {userTyping && <TypingLoader/>}

      <div ref={bottomRef}/>

    </Stack>
    <form
       style={{
        height:"10%",

       }}
       onSubmit={submitHandler}
    >
      <Stack direction={"row"}
              height="100%"
              padding={"1rem"}
              alignItems={"center"}
              position={"relative"}
              >
        <IconButton 
           sx={{
            position:"relative",
            rotate:"30deg",
           }}
           onClick={handleFileOpen}
        >
          <AttachFileIcon/>
        </IconButton>
        
        <InputBox 
        placeholder='Type Here....'
        value={message}
        onChange={messageOnChange} 
        />

        <IconButton
          type='submit'
          sx={{
            bgcolor:Orange,
            color:"white",
            marginLeft:"1rem",
            padding:"0.5rem",
            "&:hover":{
              bgcolor:"error.dark",
            }


          }}
        >
          <SendIcon/>
        </IconButton>
      </Stack>

    </form>
     <FileMenu anchorEl={fileMenuAnchor} chatId={chatId}/>
    </>
  )
}

export default AppLayout()(Chat)
