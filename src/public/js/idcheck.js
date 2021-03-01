$('#username').keyup(function() {
  if($('#username').val().length >= 5) {
    $.get('/api/auth/checkId?username='+$('#username').val(), function(result) {
      if (result.result !== null) {
        $('#username').css('border', 'solid 2px red');
        $('#idCheckMsg').css('color', 'red');
        $('#idCheckMsg').html('아이디가 이미 존재합니다.');
      } else {
        $('#username').css('border', 'solid 2px green');
        $('#idCheckMsg').css('color', 'green');
        $('#idCheckMsg').html('사용 가능합니다.');
      }
    });
  } else {
    $('#username').css('border', 'solid 2px red');
    $('#idCheckMsg').css('color', 'red');
    $('#idCheckMsg').html('5자리 이상 입력해주세요');
  }
});