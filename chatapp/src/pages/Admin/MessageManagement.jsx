import { Avatar, Box, Skeleton, Stack } from '@mui/material'
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import RenderAttachments from "../../components/shared/RenderAttachments"
import Table from '../../components/shared/Table'
import { server } from '../../constants/config'
import { useErrors } from '../../hooks/hook'
import { fileFormat, transformImage } from '../../lib/features'

const columns=[
  {
    field:"id",
    headerName:"ID",
    headerClassName:"table-header",
    width:200,
  },

  {
    field:"attachments",
    headerName:"Attachments",
    headerClassName:"table-header",
    width:200,
    renderCell:(params)=>{
      const { attachments } =params.row;
        
      return attachments?.length>0 ? attachments.map((i)=>{

        const url=i.url;
        const file=fileFormat(url);

        return <Box>
          <a href={url}
             download
             target='_blank'
             style={{
              color:"black",
             }}
             >
              {RenderAttachments(file,url)}
             </a>
        </Box>
      }):
      "NO Attachments";

    }
  },
  {
    field:"content",
    headerName:"Content",
    headerClassName:"table-header",
    width:400,
  },
  {
    field:"sender",
    headerName:"Sent By",
    headerClassName:"table-header",
    width:200,
    renderCell:(params)=>(
      <Stack>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar}/>
        <span>{params.row.sender.name}</span>
      </Stack>

    )
  },
  {
    field:"chat",
    headerName:"Chat",
    headerClassName:"table-header",
    width:220,
  },
  {
    field:"groupChat",
    headerName:"Group Chat",
    headerClassName:"table-header",
    width:100,
  },
  {
    field:"createdAt",
    headerName:"Time",
    headerClassName:"table-header",
    width:250,
  },
]

const MessageManagement = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching messages from:", `${server}/api/v1/admin/messages`);

        const response = await axios.get(`${server}/api/v1/admin/messages`, {
          withCredentials: true,
        });

        console.log("Messages Response Status:", response.status);
        console.log("Messages Data:", response.data);
        setData(response.data);
      } catch (err) {
        console.error("Messages Error Details:", {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          url: err.config?.url
        });
        setError(err.response?.data?.message || err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useErrors([
    {
      isError: !!error,
      error: { data: { message: error } },
    },
  ]);

  useEffect(() => {
    if (data) {
      setRows(
        data.messages.map((msg) => ({
          ...msg,
          id: msg._id,
          attachments: msg.attachments?.map((a) => a.url) || [],
          content: msg.content || "No Text",
          sender: { name: msg.sender.name, avatar: transformImage(msg.sender.avatar, 50) },
          chat: msg.chat,
          groupChat: msg.groupChat ? "Yes" : "No",
          createdAt: moment(msg.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
        }))
      );
    }
  }, [data]);
    

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table heading={"All Messages"} columns={columns} rows={rows} rowHeight={200} />
      )}
    </AdminLayout>
  )
}

export default MessageManagement
