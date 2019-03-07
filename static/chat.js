 var request =function (){
    const myHeaders = new Headers();
   myHeaders.append('Content-Type', 'application/json');
   myHeaders.append('x-access-token', localStorage.getItem("token"));
   fetch('http://localhost:5000/api/me', {
    method: 'GET',
    headers: myHeaders
  }).then(res => res.json())//response type
  .then(data =>{
    if(data.auth !=false){
      localStorage.setItem("user",true)
    }else{
      window.location ='/'
    }
  });
 }
 request()
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
      socket.emit('true',{userName:user});
      socket.emit('create', {roomNumber:1,userName:user});

      //change room color
    socket.on('connected',(data)=>{
      $('.chat').removeClass(`bg-${data.oldColor}`);
      $('.chat').addClass(`bg-${data.newColor}`)
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
      console.log(data);
      chatRoom.append($('<li> ('+time+') <b> '+ data.userName+ '</b>'+ ' says:  '+ data.message+ '</li>'));
    
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

    //emit disconnection
    disconnect.click(function(){
      socket.emit('disconnection',{userName:user})
      console.log(user)
      localStorage.removeItem('user');
      window.location = "/login";
  })
    
 
  