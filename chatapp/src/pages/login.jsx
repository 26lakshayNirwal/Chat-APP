import {
  CameraAlt as CameraAltIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { server } from '../constants/config';
import { userExists } from '../redux/reducers/auth';


const useFileHandler = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const changeHandler = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  return { file, preview, changeHandler };
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const toggleLogin = () => setIsLogin((prev) => !prev);
  const avatar = useFileHandler();
  const dispatch = useDispatch();
  

  // refs for form inputs
  const name = useRef();
  const bio = useRef();
  const username = useRef();
  const password = useRef();

  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": isLogin ? "application/json" : "multipart/form-data",
    },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
   const toastId= toast.loading("Logging in...");
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.current.value,
          password: password.current.value,
        },
        config
      );

      dispatch(userExists(data.user));
  
      toast.success(data.message, {id:toastId});
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {id:toastId});
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const toastId= toast.loading("Creating account...");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.current.value);
    formData.append("bio", bio.current.value);
    formData.append("username", username.current.value);
    formData.append("password", password.current.value);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExists(data.user));
      
      toast.success(data.message,{
        id:toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {id:toastId});
    }
    finally {
      setIsLoading(false);
    }
  };

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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{ width: "100%", marginTop: "1rem" }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  inputRef={username}
                />
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  inputRef={password}
                />
                <Button
                  sx={{ marginTop: "1rem" }}
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  Login
                </Button>
                <Typography textAlign="center" m="1rem">
                  OR
                </Typography>
                <Button variant="text" fullWidth onClick={toggleLogin} disabled={isLoading}> 
                  Sign Up
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">SignUp</Typography>
              <form
                style={{ width: "100%", marginTop: "1rem" }}
                onSubmit={handleSignUp}
              >
                <Stack alignItems="center" position="relative" width="100%">
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 80,
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    component="label"
                  >
                    <CameraAltIcon />
                    <input
                      type="file"
                      onChange={avatar.changeHandler}
                      style={{ display: "none" }}
                    />
                  </IconButton>
                </Stack>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  inputRef={name}
                />
                <TextField
                  required
                  fullWidth
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                  inputRef={bio}
                />
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  inputRef={username}
                />
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  inputRef={password}
                />
                <Button
                  sx={{ marginTop: "1rem" }}
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  Sign Up
                </Button>
                <Typography textAlign="center" m="1rem">
                  OR
                </Typography>
                <Button variant="text" fullWidth onClick={toggleLogin} disabled={isLoading}>
                  Login
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
