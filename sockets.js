const axios = require('axios');
const controller = require('./controller/controller')
var d = new Date();

/* Algorithm
1- set user to true
2- grab user list from data base 
3- join new user to the room 
*/

module.exports = function(io){
   io.on('connect', function(socket) {

      socket.room = 1
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
        
         //update connected user list
         axios.get('http://localhost:5000/api/users')
         .then(function (response) {
            io.sockets.in(room.roomNumber).emit('users',{ users:response.data});
          }).catch(function (error) {console.log(error);});

         //join the new user to the new room
         socket.join(room.roomNumber);
         socket.room = room.roomNumber
       
         // emit to everyone else in the room 
         socket.broadcast.to(socket.room).emit('new_update',{message:`** ${socket.userName} joined the chat **`,update:"no"} );
         })

       //listen on new_message
       socket.on('new_message',(data)=>{
         console.log(socket.room)
         controller.addHistory(data.userName,data.message,controller.time(d),controller.date(d),socket.room)
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
            //add log
            controller.addLog(room.userName,controller.date(d),controller.time(d),"Joined")

            socket.room = room.roomNumber;
            socket.join(socket.room);

            // emito update to the old room
            io.sockets.in(oldRoom).emit('new_update',  {message: `** ${socket.userName} left the room **`} );  
            // emit update to the new room
            io.sockets.in(room.roomNumber).emit('list_update',{userName:socket.userName,status:true});
            io.sockets.in(room.roomNumber).emit('connected',  {oldColor:"danger",newColor:color} ); 
            io.sockets.in(room.roomNumber).emit('new_update',  {message:`** ${socket.userName} joined a new room **`} );  
      });

      // disconnection
      socket.on("disconnection",(data)=>{
            var d = new Date();
            //add log
            controller.addLog(data.userName,controller.date(d),controller.time(d),"disconnection")

            io.sockets.in(socket.room).emit('list_update',{userName:data.userName,status:false});
            //emite the disconnection update
            socket.to(socket.room).emit('new_update',  {message:`** ${data.userName} disconnected **`} );
            controller.setFalse(data.userName)
      })
      
   })
  
}