var displayNotifs = function(notifs){
	if (notifs && notifs.length > 0)
	{
		notifs.forEach( function(notif) {
			var button = [{
				addClass: 'btn btn-primary', text: 'X',
				onClick: function($noty) {
					$noty.close();

					$.ajax({
						type        : 'DELETE',
						url         : '/notif',
						data        : {'id':notif.id},
						dataType    : 'json',
						encode      : true
					})
						.done(function(send) {
						});
				}
			}];

			noty({text: notif.src_login
				+ ' t\'as notifie de type '
					+ notif.type,
				buttons: button});
		});
	}
};

var getAllNotifs = function(){
	$.ajax({
		type        : 'GET',
		url         : '/notif',
		data        : null
	})
		.done(function(result) {
			if (result.status == 'success')
				displayNotifs(result.data);
			else
				alert('Could not load notifs');
		});
};

var storeUser = function(){
	var user = JSON.parse(sessionStorage.getItem('user'));
	if (user && user.login)
		$('#account').html(user.login);
	else
	{
		$.ajax({
			type        : 'get',
			url         : '/selfBasic',
			data        : null
		})
			.done(function(send) {
				if (send.status == 'success')
				{
					sessionStorage.setItem('user',
						JSON.stringify(send.data));
					$('#account').html(send.data.login);
				}
				else
					errorRedirect(res.message);
			});
	}
};
