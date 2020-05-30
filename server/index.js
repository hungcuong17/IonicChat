const path = require('path'); // TODO: xoá sau
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const Chat = require('./models/chat'); 

// start tạo server peer để kết gọi video
const { PeerServer } = require('peer');

const peerServer = PeerServer({ port: 9000, path: '/ionicChat' });
// end tạo server peer để kết gọi video

require('dotenv').config()
// APP
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// import router
const userRoute = require('./modules/user/user.route');
const chatRoute = require('./modules/chat/chat.route');

// set static foder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static('upload'));

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// Connect to MongoDB
const db = process.env.DATABASE; // DB Config
const connect = mongoose.connect(
        db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

var userOnline =[]; // dánh sách người online
io.on('connection', (socket) => {

    // Thay đổi statusLogin người dùng khi đăng nhập thành công và gửi danh sách
    // người dùng đang online cho tất cả mọi người
    socket.on('online', async (id) => {
        socket.userId = id;
        await User.findOneAndUpdate({_id: id}, {$set: {statusLogin: "on"}});
        let chats = await Chat.find({$or: [{person1: id}, {person2: id}]},{ _id: 1});
        chats = chats.map(x=>x._id);
        chats.forEach(x=>{
            socket.join(x);
        })
        socket.join(id);
        console.log(socket.adapter.rooms);
        userOnline.push(id);
        io.sockets.emit('get_user_online', userOnline);
    });

    // // Thay đổi statusLogin người dùng khi thoắt ứng dụng và gửi danh sách 
    // // người dùng đang online cho tất cả mọi người
    // socket.on('offline', async (id) => {
    //     await User.findOneAndUpdate({_id: id}, {$set: {statusLogin: "off", timeLogout: Date.now()}});
    //     userOnline.pull(id);
    //     socket.broadcast.emit('get_user_online', userOnline);
    // });

    // bắt sự kiện click vào cuộc hội thoại(cuộc chat) khi 2 người chưa phải bạn bè
    // data truyền vào: receiverId là _id và người nhận và type=0 hoặc 1 là loại cuộc chat
    socket.on('createNewChat', async (data)=>{
        let chat = await Chat.findOne({person1: socket.userId, person2: data.receiverId});
        let chat1 = await Chat.findOne({person1: data.receiverId, person2: socket.userId});
        if(chat===null && chat1===null){
            let chatInfo = await Chat.create({person1: socket.userId, person2: data.receiverId, messages:[]})
            socket.join(chatInfo._id);
            let res = {success: true, messages: ['create_chat_success'], content: chatInfo};
            io.to(chatInfo._id).emit('outCreateNewChat', res);
            io.to(data.receiverId).emit('outCreateNewChat', res);
        }
    })

    // Tạo mới tin nhắn
    // data tryền vào: chatID là id phòng chat, content, type
    socket.on('input_create_message', async (data) => {
        let chat = await Chat.findById(data.chatID);
        let message = {senderId: socket.userId, content: data.content, type: data.type, timeSend: Date.now()};
        chat.messages.push(message);
        chat.status ='new',
        chat.save();
        io.to(data.chatID).emit('output_create_message', chat);
    })

    // Gửi yêu cầu kết bạn receiverId là _id của người nhận
    socket.on("send_request_add_friend", async (data)=>{
        let user1 = await User.findById(socket.userId);
        let user2 = await User.findById(data.receiverId);
        user1.friendResponses.push(data.receiverId);
        user2.friendRequests.push({userId:socket.userId, status:'new'});
        user1.save();
        user2.save();
        io.to(data.receiverId).emit("out_send_request_add_friend", user2);
        socket.emit("out_send_request_add_friend", user1);
    })

    // Đồng ý kết bạn receiverId là _id của người được đồng ý kết bạn
    socket.on("accept_add_friend", async (data)=>{
        let user1 = await User.findById(socket.userId);
        let user2 = await User.findById(data.receiverId);
        user1.friends.push(data.receiverId);
        user2.friends.push(socket.userId);
        user1.friendRequests.filter(x=>x.userId!==data.receiverId);
        user2.friendResponses.pull(socket.userId);
        user1.save();
        user2.save();
        io.to(data.receiverId).emit("out_accept_add_friend", user2);
        socket.emit("out_accept_add_friend", user1);
    })

    // Sự kiện người dùng gọi video 
    socket.on('caller', data=>{
        console.log(data);
        io.to(data.receiverId).emit('get_peerId', data.peerID);
    })
    // người được gọi đồng ý trả lời học không
    socket.on('status_call', dataStatus=>{
        console.log("------",dataStatus);
        io.to(dataStatus.receiverId).emit('get_status_call', dataStatus.status);
    })
    

    socket.on('disconnect', async() => {
        if(socket.userId){
            await User.findOneAndUpdate({_id: socket.userId}, {$set: {statusLogin: "off", timeLogout: Date.now()}});
            userOnline.pull(id);
            socket.broadcast.emit('get_user_online', userOnline);
        }
        console.log('User had left');
    })
})

// render api 
app.use('/api/user', userRoute);
app.use('/api/chats', chatRoute);


// Start server
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server up and running on: ${port} !`));