var password = false;
$('#password1, #password2').on('keyup', function () {
    if ($('#password1').val() == $('#password2').val()) {
      $('#message').html('Password match').css('color', 'green');
      password = true
    } else 
    password = false
      $('#message').html('Password does not match').css('color', 'red');
  });


