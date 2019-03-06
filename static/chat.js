
if(localStorage.getItem("user")){
    var socket = io();
    
    //time stamp
    function formatDate(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
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
    
      //Emit a username
      //create the initial room
      socket.emit('connect',socket);
      socket.emit('true',{userName:user});
      socket.emit('create', {roomNumber:1,userName:user});

      //change room color
    socket.on('connected',(data)=>{
      $('.chat').removeClass(`bg-${data.oldColor}`);
      $('.chat').addClass(`bg-${data.newColor}`)
    })
  
    socket.on("list_update",(data)=>{
        //console.log(data.userName)
        if(data.status == false){
            $("#"+data.userName).remove();
        }else{
            $("#"+data.userName).remove();
            users.append($('<li '+'id='+data.userName+'>'+'('+time+') '+data.userName+'</li>'  ));
        }
    })
    
    //emit disconnection
    disconnect.click(function(){
        socket.emit('disconnection',{userName:user})
        console.log(user)
        localStorage.removeItem('user');
        window.location = "/login";
    })
  
    //emit message
    send_message.click(function(){
      socket.emit('new_message',{message:message.val(),userName:user})
      $('#m').val('');
    })
    
    //listen on new_message
    socket.on("new_message",(data)=>{
      console.log(data);
      chatRoom.append($('<li> ('+time+') <b> '+ data.userName+ '</b>'+ ' says:  '+ data.message+ '</li>'));
    
    })
    
    //listen to update messages
    socket.on("new_update",(data)=>{
      chatRoom.append($('<li> <i>'+ data.message + '<i>'+'</li>' ));
    })
    
    //list users
    socket.on('users',(data)=>{
      
        for (var i = 0; i < data.users.length; i++) {
          if (data.users[i].connected == true){
            console.log(data.users)
            $("#"+data.users[i].user).remove()
            users.append($('<li '+'id='+data.users[i].user+'>'+'('+time+') '+data.users[i].user+'</li>'  ));
          }
        }
    })
    
    
    //change room 
    room_change.click(function(){
      socket.emit('changeRoom',{roomNumber:2,userName:user})
    })
    
  }else{
    window.location= "/login"
  }
  