
$("#btn").click(function(){
//input
var email =$("#email").val()
var password =$("#password").val()
  

    var data = {
        "email": email,
        "password":password
}	;
    
     fetch('http://localhost:5000/api/login', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data) 

}).then(res => res.json())//response type
.then(data =>{
    localStorage.setItem("token",data.token)
    window.location = "/chat"

    
}); //log the data;

});


