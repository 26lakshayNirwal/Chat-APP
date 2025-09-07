import React, { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectRoute from './components/styles/auth/ProtectRoute';
import { LayoutLoader } from './components/layout/Loaders';
import axios from 'axios';
import { server } from './constants/config';
import {useDispatch, useSelector} from 'react-redux';
import {userExists, userNotExists } from './redux/reducers/auth';
import {Toaster} from 'react-hot-toast';
import { SocketProvider } from '../socket';

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/login"));
const Chat = lazy(() => import("./pages/Chat"));
const Group = lazy(() => import("./pages/group"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(()=> import('./pages/Admin/AdminLogin'));
const Dashboard = lazy(()=> import('./pages/Admin/Dashboard'));
const UserManagement = lazy(()=> import('./pages/Admin/UserManagement'));
const ChatManagement = lazy(()=> import('./pages/Admin/ChatManagement'));
const MessageManagement = lazy(()=> import('./pages/Admin/MessageManagement'));



const App = () => {

  const {user } = useSelector(state => state.auth)

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);


  return  (
    <BrowserRouter>
    <Suspense fallback={<LayoutLoader/>}>
      <Routes>
        <Route element={
          <SocketProvider>
            <ProtectRoute user={user}/>
          </SocketProvider>
        }>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="/group" element={<Group />} />
        </Route>
        
        <Route path="/login" element={
          <ProtectRoute user={!user} redirect="/">
            <Login/>
          </ProtectRoute>
        } 
        />
        
        <Route path='/admin' element={<AdminLogin/>}/>
        <Route path='/admin/dashboard' element={<Dashboard/>}/>
        <Route path='/admin/users-management' element={<UserManagement/>}/>
        <Route path='/admin/chats-management' element={<ChatManagement/>}/>
        <Route path='/admin/messages-management' element={<MessageManagement/>}/>

        <Route path="*" element={<NotFound />} />
        
      </Routes>
      </Suspense>
      <Toaster position='bottom-center'/>
    </BrowserRouter>
  )
}

export default App
