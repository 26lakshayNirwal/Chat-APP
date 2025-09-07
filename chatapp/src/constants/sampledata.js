    

 export const samplechats=[
{
    avatar:["https://randomuser.me/api"],
    name:"Aman",
    _id:"1",
    groupChat:false,
    members:["1","2"],
},
{
    avatar:["https://randomuser.me/api"],
    name:"Arav",
    _id:"2",
    groupChat:false,
    members:["1","2"],
},
];

export const sampleusers=[
{
    avatar:["https://randomuser.me/api"],
    name:"Aman",
    _id:"1",
},
{
    avatar:["https://randomuser.me/api"],
    name:"Arav",
    _id:"2",
}]

export const sampleNotifications=[
    {
        sender:{
            avatar:["https://randomuser.me/api"],
        name:"Aman",
        },
        _id:"1",
    },
    {
        sender:{
            avatar:["https://randomuser.me/api"],
        name:"Arav",
        },
        _id:"2",
    }]

    export const sampleMessage=[
        {
            
            content:"hello i m here",
            _id:"abcgjnm",
            sender:{
                _id:"user._id",
                name:"Aman",
            },
            chat:"chatId",
            createdAt:"2025-03-12"
        },
        {
            attachments:[
              {
                public_id:"abcgjn",
                url:"https://www.w3schools.com/howto/img_avatar.png"
              },
            ],
            
            _id:"abcgjn",
            sender:{
                _id:"abc",
                name:"Aman 2",
            },
            chat:"chatId",
            createdAt:"2025-03-12"
        },
    ];

    export const dashboardData={
        users:[
            {
                avatar:["https://randomuser.me/api"],
                name:"Aman",
                _id:"1",
                username:"aman",
                friends:20,
                groups:5,
            },

            {
                avatar:["https://randomuser.me/api"],
                name:"Arav",
                _id:"2",
                username:"arav",
                friends:25,
                groups:7,
            }
        ],
        chats: [
            {
                _id: "chat1",
                avatar: ["https://randomuser.me/api"],
                name: "Aman & Arav Chat",
                totalMembers: 2,
                members: [
                    {
                        avatar: ["https://randomuser.me/api"],
                        name: "Aman",
                        _id: "1",
                    },
                    {
                        avatar: ["https://randomuser.me/api"],
                        name: "Arav",
                        _id: "2",
                    }
                ],
                totalMessages: 50,
                creator: {
                    name: "Aman",
                    avatar: "https://randomuser.me/api",
                }
            },
            {
                _id: "chat2",
                avatar: ["https://randomuser.me/api"],
                name: "Tech Group",
                totalMembers: 5,
                members: [
                    {
                        avatar: ["https://randomuser.me/api"],
                        name: "Aman",
                        _id: "1",
                    },
                    {
                        avatar: ["https://randomuser.me/api"],
                        name: "Arav",
                        _id: "2",
                    },
                    {
                        avatar: ["https://randomuser.me/api"],
                        name: "Rohan",
                        _id: "3",
                    },
                    {
                        avatar: ["https://randomuser.me/api"],
                        name: "Vikram",
                        _id: "4",
                    },
                    {
                        avatar: ["https://randomuser.me/api"],
                        name: "Rahul",
                        _id: "5",
                    }
                ],
                totalMessages: 120,
                creator: {
                    name: "Arav",
                    avatar: "https://randomuser.me/api",
                }
            }
        ],

        messages: [
            {
              _id: "msg1",
              content: "Hey Arav! How's it going?",
              attachments: [{ public_id: "attach1", url: "https://example.com/img1.png" }],
              sender: { _id: "1", name: "Aman", avatar: "https://randomuser.me/api" },
              chat: "chat1",
              groupChat: false,
              createdAt: "2025-03-20",
            },
            {
              _id: "msg2",
              content: "Hey Aman! I'm doing great. What about you?",
              attachments: [{ public_id: "attach2", url: "https://example.com/img2.png" }],
              sender: { _id: "2", name: "Arav", avatar: "https://randomuser.me/api" },
              chat: "chat1",
              groupChat: false,
              createdAt: "2025-03-20",
            },
            {
              _id: "msg3",
              content: "Guys, the meeting is scheduled for tomorrow.",
              attachments: [{ public_id: "attach3", url: "https://example.com/img3.png" }],
              sender: { _id: "3", name: "Rohan", avatar: "https://randomuser.me/api" },
              chat: "chat2",
              groupChat: true,
              createdAt: "2025-03-21",
            },
            {
              _id: "msg4",
              content: "Got it! What time?",
              attachments: [{ public_id: "attach4", url: "https://example.com/img4.png" }],
              sender: { _id: "4", name: "Vikram", avatar: "https://randomuser.me/api" },
              chat: "chat2",
              groupChat: true,
              createdAt: "2025-03-21",
            },
            {
              _id: "msg5",
              content: "10 AM. Please be on time.",
              attachments: [{ public_id: "attach5", url: "https://example.com/img5.png" }],
              sender: { _id: "5", name: "Rahul", avatar: "https://randomuser.me/api" },
              chat: "chat2",
              groupChat: true,
              createdAt: "2025-03-21",
            },
            {
              _id: "msg6",
              content: "Sure! See you all there. 😊",
              attachments: [{ public_id: "attach6", url: "https://example.com/img6.png" }],
              sender: { _id: "1", name: "Aman", avatar: "https://randomuser.me/api" },
              chat: "chat2",
              groupChat: true,
              createdAt: "2025-03-21",
            },
            {
              _id: "msg7",
              content: "Check out this image!",
              attachments: [{ public_id: "attach7", url: "https://www.w3schools.com/howto/img_avatar.png" }],
              sender: { _id: "2", name: "Arav", avatar: "https://randomuser.me/api" },
              chat: "chat2",
              groupChat: true,
              createdAt: "2025-03-22",
            },
          ],
          
    }