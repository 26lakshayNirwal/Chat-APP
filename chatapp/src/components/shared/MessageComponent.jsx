import { Typography, Box } from '@mui/material';
import moment from 'moment';
import React, { memo } from 'react';
import { fileFormat } from '../../lib/features';
import  RenderAttachments from './RenderAttachments.jsx';
import { motion } from 'framer-motion';
const MessageComponent = ({ message, user }) => {

    
  const { sender, content, attachments = [], createdAt } = message;
  const timeAgo = moment(createdAt).fromNow();
  const sameSender = sender?._id === user?._id;

  return (
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? 'flex-end' : 'flex-start',
        background: 'white',
        color: 'violet',
        borderRadius: '5px',
        padding: '0.5rem',
        width: 'fit-content',
        maxWidth: '70%',
      }}
    >
      {!sameSender && (
        <Typography color="#2694ab" fontWeight="700" variant="caption">
          {sender.name}
        </Typography>
      )}

      {content && <Typography>{content}</Typography>}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          if (!url) return null;

          const file = fileFormat(url);

          return (
            <Box key={index} mt={1}>
              <RenderAttachments file={file} url={url} />
            </Box>
          );
        })}

      <Typography variant="caption" color="text.secondary">
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
