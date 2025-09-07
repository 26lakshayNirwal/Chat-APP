import React, { useState } from 'react';
import { Container, Paper, TextField, Typography, Button, Stack, Avatar, IconButton } from '@mui/material';
import { CameraAlt as CameraAltIcon } from '@mui/icons-material';
import { useInputValidation } from '6pp';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin, getAdmin } from '../../redux/reducers/thunks/admin';
import { useEffect } from 'react';


const AdminLogin = () => {
    const {isAdmin}= useSelector((state)=>state.auth)
    const dispatch=useDispatch();
    const secretKey =useInputValidation("")

  const submitHandler=(e)=>{
      e.preventDefault();
      dispatch(adminLogin(secretKey.value))
  }

  useEffect(()=>{
    dispatch(getAdmin())
  },[dispatch])


  if(isAdmin) return <Navigate to="/admin/dashboard" />;

  return (
    <div
    style={{
        background: "linear-gradient(rgb(54 32 200 / 50%), rgb(179 11 11 / 50%))",
    }}
    >
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        
            <Typography variant="h5"> Admin Login</Typography>
            <form
              style={{
                width: '100%',
                marginTop: '1rem',
              }}
              onSubmit={submitHandler}
            >
              
              <TextField 
                 required 
                 fullWidth 
                 label="Secret Code" 
                 type="password" 
                 margin="normal" 
                 variant="outlined" 
                 value={secretKey.value} 
                 onChange={secretKey.changeHandler} 
                 />

              <Button sx={{ marginTop: '1rem' }} fullWidth variant="contained" color="primary" type="submit">
                 Login
              </Button>
            </form>
         
      </Paper>
    </Container>
    </div>
  )
}

export default AdminLogin
