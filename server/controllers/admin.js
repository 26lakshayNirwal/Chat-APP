import jwt from "jsonwebtoken";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { cookieOption } from "../utils/features.js";
import { adminSecretKey } from "../app.js";

//import { adminSecretKey } from "../app.js";

const adminLogin = async (req, res, next) => {
  const { secretKey } = req.body;

  

  const isMatched = secretKey === adminSecretKey;

  if (!isMatched) return next(new Error("Invalid Admin Key", 401));

  const token = jwt.sign(secretKey, process.env.JWT_SECRET);

  return res
    .status(200)
    .cookie("chat-admin-token", token, {
      ...cookieOption,
      maxAge: 1000 * 60 * 15,
    })
    .json({
      success: true,
      message: "Authenticated Successfully, Welcome",
    });
};

const adminLogout =async (req, res, next) => {
  return res
    .status(200)
    .cookie("chat-admin-token", "", {
      ...cookieOption,
      maxAge: 0,
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
};

const getAdminData = async (req, res, next) => {
  return res.status(200).json({
    admin: true,
  });
};

const allUsers = async (req, res) => {
  const users = await User.find({});

  const transformedUsers = await Promise.all(
    users.map(async ({ name, username, avatar, _id }) => {
      const [groups, friends] = await Promise.all([
        Chat.countDocuments({ groupChat: true, members: _id }),
        Chat.countDocuments({ groupChat: false, members: _id }),
      ]);

      return {
        name,
        username,
        avatar: avatar.url,
        _id,
        groups,
        friends,
      };
    })
  );

  return res.status(200).json({
    status: "success",
    users: transformedUsers,
  });
};

const allChats = async (req, res) => {
  const chats = await Chat.find({})
    .populate("members", "name avatar")
    .populate("creator", "name avatar");

  const transformedChats = await Promise.all(
    chats.map(async ({ members, _id, groupChat, name, creator }) => {
      const totalMessages = await Message.countDocuments({ chat: _id });

      return {
        _id,
        groupChat: groupChat || false,
        name: name || "Unnamed Chat",
        avatar: (members || []).slice(0, 3).map((member) => member?.avatar?.url || ""),
        members: (members || []).map(({ _id, name, avatar }) => ({
          _id,
          name: name || "Unknown User",
          avatar: avatar?.url || "",
        })),
        creator: {
          name: creator?.name || "None",
          avatar: creator?.avatar?.url || "",
        },
        totalMembers: (members || []).length,
        totalMessages,
      };
    })
  );

  return res.status(200).json({
    status: "success",
    chats: transformedChats,
  });
};

const allMessages = async (req, res) => {
  const messages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chat", "groupChat");

  const transformedMessages = messages
    .filter(msg => msg.sender && msg.chat) // Filter out messages with missing sender or chat
    .map(({ content, attachments, _id, sender, createdAt, chat }) => ({
      _id,
      attachments: attachments || [],
      content: content || "",
      createdAt,
      chat: chat._id,
      groupChat: chat.groupChat || false,
      sender: {
        _id: sender._id,
        name: sender.name || "Unknown User",
        avatar: sender.avatar?.url || "",
      },
    }));

  return res.status(200).json({
    success: true,
    messages: transformedMessages,
  });
};

const getDashboardStats =async (req, res) => {
  const [groupsCount, usersCount, messagesCount, totalChatsCount] =
    await Promise.all([
      Chat.countDocuments({ groupChat: true }),
      User.countDocuments(),
      Message.countDocuments(),
      Chat.countDocuments(),
    ]);

  const today = new Date();

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const last7DaysMessages = await Message.find({
    createdAt: {
      $gte: last7Days,
      $lte: today,
    },
  }).select("createdAt");

  const messages = new Array(7).fill(0);
  const dayInMiliseconds = 1000 * 60 * 60 * 24;

  last7DaysMessages.forEach((message) => {
    const indexApprox =
      (today.getTime() - message.createdAt.getTime()) / dayInMiliseconds;
    const index = Math.floor(indexApprox);

    messages[6 - index]++;
  });

  const stats = {
    groupsCount,
    usersCount,
    messagesCount,
    totalChatsCount,
    messagesChart: messages,
  };

  return res.status(200).json(
    {
      success: true,
      stats,
    }
  );
};

export {
  allUsers,
  allChats,
  allMessages,
  getDashboardStats,
  adminLogin,
  adminLogout,
  getAdminData,
};