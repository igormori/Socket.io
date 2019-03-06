var request = require('request')
const axios = require('axios');


// Add the WebSocket handlers
module.exports = function(io){
   
   io.on('connect', function(socket) {

         //message only for the socket
         socket.emit('new_update',  {message: `** you have joined a new chat **`} ); 

         socket.userName = ""
         //create the initial room
         socket.room = 1;
      
         socket.on('create', function(room) {
        
            //update connected user list
            axios.get('http://localhost:5000/api/history')
            .then(function (response) {
               io.sockets.in(socket.room).emit('users',{ users:response.data});
            })
            .catch(function (error) {
               console.log(error);});

            //join the new user to the new room
            socket.join(room.roomNumber);
            socket.room = room.roomNumber;
            socket.userName = room.userName;
            
            //send update message
            // emit to everyone else in the room 
            socket.broadcast.to(socket.room).emit('new_update',  {message:`** ${socket.userName} joined the chat **`,update:"no"} );
            io.sockets.in(socket.room).emit('list_update',{userName:room.userName, status:true});
         })
        
         // set user to true when connected
         socket.on("true",(data)=>{
            request.put({
               url: `http://localhost:5000/api/history/${data.userName}`, 
               json: {
                  connected:true
               }
         }, function(error, response, body) {
               try{
                  response.body.connected
               }catch(error){
                  console.log(error)
               }
         })
         })
         
         // disconnection
         socket.on("disconnection",(data)=>{
            io.sockets.in(socket.room).emit('list_update',{userName:data.userName,status:false});
            //emite the disconnection update
            socket.to(socket.room).emit('new_update',  {message:`** ${data.userName} disconnected **`} );
            request.put({
               url: `http://localhost:5000/api/history/${data.userName}`, 
               json: {
                  connected:false
               }
         }, function(error, response, body) {
               try{
                  console.log(data.userName+" dis")
               }catch(error){
                  console.log(error)
               }
         })
         
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
            io.sockets.in(oldRoom).emit('list_update',{userName:socket.userName,status:false});
            io.sockets.in(oldRoom).emit('new_update',  {message: `** ${socket.userName} left the room **`} );  
            // emit update to the new room
            io.sockets.in(room.roomNumber).emit('list_update',{userName:socket.userName,status:true});
            io.sockets.in(room.roomNumber).emit('connected',  {oldColor:"danger",newColor:color} ); 
            io.sockets.in(room.roomNumber).emit('new_update',  {message:`** ${socket.userName} joined a new room **`} );  
         
      });
      
   })
  
         
   
    
    // socket.on('userName', function(data) {
    //     console.log(data);
    //     request.post({
    //         url: 'http://localhost:5000/api/history', 
    //         json: {
    //             email:data
    //         }
    //     }, function(error, response, body) {
    //         try{
    //             console.log("history created")
    //         }catch(error){
    //             console.log(error)
    //         }
    //     })
    //     })


     //list in the room
   //   var d = new Date();
   //   request.post({
   //              url: 'http://localhost:5000/api/history', 
   //              json: {
   //                  user:socket.userName,
   //                  date:dateF.date(d),
   //                  time:dateF.time(d),
   //                  room:socket.room,
   //                  connected:true
   //              }
   //          }, function(error, response, body) {
   //              try{
   //                  console.log("history created")
   //              }catch(error){
   //                  console.log(error)
   //              }
   //          })
        
        
 }






      
         // var clients = io.sockets.adapter.rooms[room.roomNumber].sockets;
         // socket.userName=Object.keys(clients);
         // socket.index= socket.userName.lenght
         // console.log(socket.userName[socket.index-1])