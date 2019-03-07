  var socket = io();
    
    //time stamp
    function formatDate(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; 
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + '' + ampm;
      return strTime;
    }
    var d = new Date();
    var time = formatDate(d);
 
    // inputs
    var message = $('#m');
    var send_message = $('#sub');
    var chatRoom = $('#messages');
    var users = $('#users');
    var room_change =$('#btnChange');
    var user = localStorage.getItem("user");
    var disconnect = $("#btnDisconnect");
    
      //create the initial connection
      socket.emit('connect',socket);
      console.log(user)
      socket.emit('true',{userName:user});
      socket.emit('create', {roomNumber:1,userName:user});

      //change room color
    socket.on('room_color',(data)=>{
      console.log(data.newColor)
      if(!data.oldColor){
        $('.chat').addClass(`bg-${data.newColor}`)
      }else{
        $('.chat').removeClass(`bg-${data.oldColor}`);
        $('.chat').addClass(`bg-${data.newColor}`)
      }
    
    })
  
    //emit message
    send_message.click(function(){
      socket.emit('new_message',{message:message.val(),userName:user})
      $('#m').val('');
    })
    
    //listen to update messages
    socket.on("new_update",(data)=>{
      chatRoom.append($('<li> <i>'+ data.message + '<i>'+'</li>' ));
    })
    
    //listen on new_message
    socket.on("new_message",(data)=>{
      chatRoom.append($('<li> ('+time+') <b> '+ data.userName+ '</b>'+ ' says:  '+ data.message+ '</li>'));
    })

    socket.on("list_update",(data)=>{
      if(data.status == false){
        if(!$("#"+data.userName).length == 0) {
          $("#"+data.userName).remove()
        }
      }else{
        $("#"+data.userName).remove()
        users.append($('<li '+'id='+data.userName+'>'+'('+time+') '+data.userName+'</li>'  ));
      }
    })
    
    //list users
    socket.on('users',(data)=>{
      console.log(data)
      if(!$("#"+data.users).length == 0) {
        $("#"+data.users).remove()
        users.append($('<li '+'id='+data.users+'>'+'('+time+') '+data.users+'</li>'  ));
      }else{
        users.append($('<li '+'id='+data.users+'>'+'('+time+') '+data.users+'</li>'  ));
      }
     
     
          
        
    })
    
    //change room 
    room_change.click(function(){
      socket.emit('changeRoom',{roomNumber:2,userName:user})
    })

    //emit disconnection
    disconnect.click(function(){
      socket.emit('disconnection',{userName:user})
      localStorage.clear()
      window.location="/";
    
  })
    
 
  