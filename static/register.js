 
  $("#btn").click(function(){
    var email =$("#email").val()
    var password =$("#password1").val()
    var userName =$("#userName").val()
   

    //input
 
    var data = {
      "user":userName,
      "email": email,
      "password":password

}	;

    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data) 
    
    })
    .then(data =>{
       if(data.status= 500){
         $('#message').html("User already exist, Please try again! ");
         $("#message").addClass('alert alert-danger');
       }else{
         window.location = "/"
       }
      
    
        
    }); //log the data;
  });



