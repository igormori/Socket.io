var request = require('request')
const axios = require('axios');
const controller = require('./controller/controller')


// Add the WebSocket handlers
module.exports = function(io){
   
   io.on('connect', function(socket) {

       // set user to true when connected
       socket.on("true",(data)=>{
         controller.setTrue(data.userName);
      })

         //message only for the socket
         socket.emit('new_update',  {message: `** you have joined a new chat **`} ); 

         socket.userName = ""
         //create the initial room
         socket.room = 1;
      
         socket.on('create', function(room) {
        
            //update connected user list
            axios.get('http://localhost:5000/api/users')
            .then(function (response) {
               io.sockets.in(socket.room).emit('users',{ users:response.data});
            })
            .catch(function (error) {console.log(error);});

            //join the new user to the new room
            socket.join(room.roomNumber);
            socket.room = room.roomNumber;
            socket.userName = room.userName;
            
            //send update message
            // emit to everyone else in the room 
            socket.broadcast.to(socket.room).emit('new_update',  {message:`** ${socket.userName} joined the chat **`,update:"no"} );
         })
         
         // disconnection
         socket.on("disconnection",(data)=>{
            io.sockets.in(socket.room).emit('list_update',{userName:data.userName,status:false});
            //emite the disconnection update
            socket.to(socket.room).emit('new_update',  {message:`** ${data.userName} disconnected **`} );
            controller.setFalse(data.userName)
         })

       //listen on new_message
       socket.on('new_message',(data)=>{
         io.sockets.in(socket.room).emit('new_message',{ message:data.message , userName:data.userName}); 
       });

      // Change room
      socket.on("changeRoom", (room) => {
         var color = ""
         if(socket.room == 2){
            room.roomNumber +=-1 ;
            color = "warning";
         }else{
            color = "danger";
         }
            var oldRoom =  socket.room
            socket.leave(socket.room, function (err) {
               // display null
               // display the same list of rooms the specified room is still there
            });
            socket.room = room.roomNumber;
            socket.join(socket.room);

            // emito update to the old room
            io.sockets.in(oldRoom).emit('new_update',  {message: `** ${socket.userName} left the room **`} );  
            // emit update to the new room
            io.sockets.in(room.roomNumber).emit('list_update',{userName:socket.userName,status:true});
            io.sockets.in(room.roomNumber).emit('connected',  {oldColor:"danger",newColor:color} ); 
            io.sockets.in(room.roomNumber).emit('new_update',  {message:`** ${socket.userName} joined a new room **`} );  
         
      });
      
   })
  
}