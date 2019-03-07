$("#btn").click(function(){
    localStorage.setItem("user",$("#userName").val())
    window.location = "/chat";
   })