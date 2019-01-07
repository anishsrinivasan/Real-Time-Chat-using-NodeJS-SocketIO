const session = require('express-session')
const express = require('express')
const http = require('http');
var cors = require('cors');
var router = express.Router();
const socketIo = require('socket.io');
var app = express();
app.use(cors());
var connections = [];
var users = [];
var usersList = {};
var conversations = [];

// Mongoose
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://tester:tester123@ds121099.mlab.com:21099/chat', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open',() => {
  console.log('Connection Established')
})
var Issue = require('./models/Issue')
// Create Server for IO
var server = http.Server(app);
const io = socketIo(server)
const uuidv1 = require('uuid/v1');
io.on('connection',(socket) => {
  console.log('New Connection')
  connections.push(socket)
  console.log(connections.length)


  socket.on('newUser',(data)=> {
    socket.username = data;
    let username = data;
    socket.join('room');
    addToUsers(socket,username)
    updateUserNames();
  })

  socket.on('disconnect',(socket)=> {
    console.log(users)
    users.splice(users.indexOf(socket.username),1)
    console.log(users)
    connections.splice(connections.indexOf(socket),1)
    updateUserNames();
    console.log('User Disconnected')
    console.log(connections.length)
  })


  socket.on('sendMessage',(data)=> {
    console.log(data)
    updateConversation(data)
    io.emit('newMessage',data)

  })

  socket.on('setMessageRead',(data)=> {
    console.log(data)
    io.emit('messageRead',data)

  })

  socket.on('emitTyping',(data)=> {
    console.log(data)
    io.emit('onTyping',data)

  })
  


})

// Posts

router.get('/getMessages', function (req, res,next) {
  console.log('Getting Messages')
  Issue.find({}, function (err, data) {
 
      if(err){
        console.log(err)
        res.send('Error')
      }else{
       // console.log(data)
        console.log('No Errors ',new Date())
        res.json(data);
      }
     
  });
});

function updateConversation(data){
  let issue = new Issue({
    senderId:data.senderId,
    msg:data.msg,
    avatarId:data.avatarId,
    timestamp:new Date()
  })
  issue.save().then(issue => {
console.log('Message Updated to DB')
  }).catch(err => {
  })
}

function updateUserNames(){
  io.emit('getUsers',users)
}




function addToUsers(socket,username){
users.push(username)
usersList[username]=socket;

}



app.use('/', router);
app.listen(3000, () => console.log('Server Listening at 3000'))

server.listen(3220, () => {
  console.log('Server Listening at 3220')
})