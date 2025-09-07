import { Search as SearchIcon } from '@mui/icons-material';
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMutation } from '../../hooks/hook';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import { setIsSearch } from '../../redux/reducers/misc';
import UserItem from '../shared/UserItem';



const Search = () => {
  const {isSearch}= useSelector((state)=>state.misc)

  const dispatch = useDispatch();

  const [users, setUsers] = useState([])

  const [search, setSearch] = useState("");

  const[searchUser]= useLazySearchUserQuery();

  const [sendFriendRequest , isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);

  const addFriendHandler =async (id) => {
    await sendFriendRequest("Sending Friend Request...",{ userId : id});
  };

  
   
  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  const searchClose=()=>dispatch(setIsSearch(false));

  useEffect(()=>{
    const timeOutId = setTimeout(()=>{
      searchUser(search)
      .then(({data})=>setUsers(data.users))
      .catch((e)=>console.log(e));
    },1000);

    return ()=>{
      clearTimeout(timeOutId);
    };
  },[search]);

  return (
    <Dialog open={isSearch} onClose={searchClose}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search}
          onChange={handleChange}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <List>
          {users.map((i) => (
            <UserItem
              user={i} 
              key={i._id} 
              handler={addFriendHandler} 
              handlerIsLoading={isLoadingSendFriendRequest}
              />
            ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
