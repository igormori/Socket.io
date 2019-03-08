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
         console.log(room.userName)
         axios.get(`http://localhost:5000/api/users/${room.userName}`)
         .then(function (response) {
               socket.join(response.data[0].room);
               socket.room = room.roomNumber = response.data.room
               console.log(response.data[0].email + " Connected")
               socket.userName = response.data[0].user
               socket.broadcast.to(response.data[0].room).emit('new_update',{message:`** ${response.data[0].user} joined the chat **`} );
               io.sockets.in(response.data[0].room).emit('room_color',  {newColor:socket.colors[response.data[0].room-1]} ); 
               io.sockets.in(response.data[0].room).emit('list_update',{userName:response.data[0].user,status:true});
          }).catch(function (error) {console.log(error);});
         })

       //listen on new_message
       socket.on('new_message',(data)=>{
         controller.addHistory(data.userName,data.message,controller.time(d),controller.date(d),socket.room)
         io.sockets.in(socket.room).emit('new_message',{ message:data.message , userName:socket.userName}); 
       });


      // Change room
      socket.on("changeRoom", (room) => {
            var oldRoom =  socket.room
            if(socket.room < 5){
               socket.room ++;
            }else{
               socket.room =1;
            }
            console.log("Room changed to: "+socket.room)
            
            socket.leave(oldRoom, function (err) {
               // display null
               // display the same list of rooms the specified room is still there
            });
            //add log
            controller.addLog(room.userName,controller.date(d),controller.time(d),"Joined")
            controller.setRoom(room.userName,socket.room)
            socket.join(socket.room);

            // emito update to the old room
            io.sockets.in(oldRoom).emit('new_update',  {message: `** ${socket.userName} left the room **`} );  
            io.sockets.in(oldRoom).emit('list_update',{userName:socket.userName,status:false});
            // emit update to the new room
            io.sockets.in(socket.room).emit('list_update',{userName:socket.userName,status:true});
            io.sockets.in(socket.room).emit('room_color',  {oldColor:socket.colors[oldRoom-1],newColor:socket.colors[socket.room-1]} );  
            io.sockets.in(socket.room).emit('new_update',  {message:`** ${socket.userName} joined the room **`} );  
      });

      // disconnection
      socket.on("disconnection",(data)=>{
            var d = new Date();
            console.log( data.userName + " Disconnected")
            //add log
            controller.addLog(data.userName,controller.date(d),controller.time(d),"disconnection")

            socket.broadcast.emit('list_update',{userName:socket.userName,status:false});
            //emite the disconnection update
            socket.to(socket.room).emit('new_update',  {message:`** ${socket.userName} disconnected **`} );
            controller.setFalse(data.userName)
      })
      
   })
  
}