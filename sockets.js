const axios = require('axios');
const controller = require('./controller/controller')
var d = new Date();
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.setMaxListeners(10000)

var list =''
module.exports = function(io){
   io.on('connect', function(socket) {

      socket.room = 1
      socket.userName =""
      socket.colors = ["primary","danger","success","warning","light"];
       //set user to true when connected
       socket.on("true",(data)=>{
         controller.setTrue(data.userName);
         //add log
         controller.addLog(data.userName,controller.date(d),controller.time(d),"connection")
      })

      //emite message for the client 
      socket.emit('new_update',  {message: `** you have joined a new chat **`} ); 
      
      //new room creation and user list update
      socket.on('create', function(room) {  
         axios.get(`http://localhost:5000/api/users/${room.userName}`)
         .then(function (response) {
               socket.userName = response.data[0].user 
               socket.room =  response.data[0].room
               socket.email = response.data[0].email
               socket.join(response.data[0].room);
               socket.broadcast.to(response.data[0].room).emit('new_update',{message:`** ${response.data[0].user} joined the chat **`} );
               io.sockets.in(response.data[0].room).emit('room_color',  {newColor:socket.colors[response.data[0].room-1]} ); 
               myEmitter.emit('users_list',{userName:response.data[0].user,room:response.data[0].room});
          }).catch(function (error) {console.log(error);});
         })
     
       //listen on new_message
       socket.on('new_message',(data)=>{
          var userList = []
          for (var i=0;i<list.length;i++){
            if(list[i].room == socket.room && list[i].email !=socket.email ){
               userList.push(list[i].email)
            }
          }
          console.log(userList)
          
         controller.addHistory(data.userName, userList , data.message ,controller.date(d),controller.time(d),socket.room)
         io.sockets.in(socket.room).emit('new_message',{ message:data.message , userName:socket.userName}); 
       });

      // Change room
      socket.on("changeRoom", (room) => {

            var userList = []
            
            
            var oldRoom =  socket.room
            if(socket.room < 5){
               socket.room ++;
            }else{
               socket.room = 1;
            }
            console.log("Room changed to: "+socket.room)
            
            socket.leave(socket.room, function (err) {
               // display null
               // display the same list of rooms the specified room is still there
            });
            //add log
            controller.addLog(room.email,controller.date(d),controller.time(d),"Joined")
            controller.setRoom(room.email,socket.room)
            socket.join(socket.room);

            // emito update to the old room
            io.sockets.in(oldRoom).emit('new_update',  {message: `** ${socket.userName} left the room **`} );  
            socket.broadcast.to(oldRoom).emit('list_update',{userName:socket.userName,status:false});
            // emit update to the new room
            myEmitter.emit('users_list',{userName:socket.userName,room:socket.room});

            io.sockets.in(socket.room).emit('list_update',{userName:socket.userName,status:true});
            io.sockets.in(socket.room).emit('room_color',  {oldColor:socket.colors[oldRoom-1],newColor:socket.colors[socket.room-1]} );  
            io.sockets.in(socket.room).emit('new_update',  {message:`** ${socket.userName} joined the room **`} );  
            // socket.emit("redirect");
            
            for (var i=0;i<list.length;i++){
               console.log(socket.room)
               if(list[i].room != socket.room && list[i].user !=socket.userName ){
                  userList.push(list[i].email)
                  console.log(list[i].user)
                  io.sockets.in(socket.room).emit('list_update',{userName:list[i].user,status:false});
               }
               }
              
            
      });

      // disconnection
      socket.on("disconnection",(data)=>{
            var d = new Date();
            console.log( data.userName + " Disconnected")
            //add log
            controller.setFalse(data.email)
            controller.addLog(data.email,controller.date(d),controller.time(d),"disconnection")

            socket.broadcast.emit('list_update',{userName:data.userName,status:false});
            
            //emite the disconnection update
            socket.to(socket.room).emit('new_update',  {message:`** ${socket.userName} disconnected **`} );
            
            
      })


       //send the list of the users in the room
       myEmitter.on('users_list',function(data){
         axios.get("http://localhost:5000/api/users")
         .then(function (response) { 
            list = response.data
            for (var i = 0; i < response.data.length; i++) {
               if(response.data[i].room == data.room && response.data[i].connected == true){
                  io.sockets.in(data.room).emit('users',{users:response.data[i].user});
                }
            }
          }).catch(function (error) {console.log(error);});
   })
   })
  
}