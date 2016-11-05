$(document).ready(function() {

	$('#log').on('click', function(event) {

		var formData = {
			'login'              : $('#login').val(),
			'passwd'             : $('#passwd').val()
		};

		$.ajax({
			type        : 'POST',
			url         : '/login',
			data        : formData,
			dataType    : 'json',
			encode          : true
		})
			.done(function(res) {
				if (res.status == 'success')
				{
					sessionStorage.setItem('user',
						JSON.stringify(res.data.user));
					window.location = 'http://localhost:1337/';
				}
				else
					errorHandle(res.message);
			});
		event.preventDefault();
	});

	$('#reset').on('click', function(e){
		e.preventDefault();
		$.ajax({
			type        : 'POST',
			url         : '/forget',
			data        : {'login':$('#forgot').val()},
			dataType    : 'json',
			encode      : true
		})
			.done(function(res) {
				if (res.status == 'success')
					alert('Mail sent to you');
				else
					errorHandle(res.message);
			});
	})

});
