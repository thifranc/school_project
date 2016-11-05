$(document).ready(function() {

	$('form').submit(function(event) {
		var token = window.location.pathname.match('/reset/([a-z0-9A-Z]*)');
		var formData = {
			'login' : $('#login').val(),
			'tmp_passwd' : token[1],
			'new_passwd' : $('#new_passwd').val()
		};
		$.ajax({
			type        : 'POST',
			url         : '/reset',
			data        : formData,
			dataType    : 'json',
			encode          : true
		})
			.done(function(res) {
				if (res.status == 'success')
				{
					alert(res.message);
					window.location = 'http://localhost:1337/login';
				}
				else
					errorHandle(res.message);
			});
		event.preventDefault();
	});

});
