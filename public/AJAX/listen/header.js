var appendNotif = function(notif){

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
};

var listenNotif = function(socket){
	socket.on('ser_notif', function(notif){
		appendNotif(notif);
	});

	socket.on('ser_msg', function(msg){

		var user = JSON.parse(sessionStorage.getItem('user'));
		if (self.document.location.hash)
			var hash = self.document.location.hash.match(ash)[1];
		else
			var hash = null;

		//rappel : var ash = new RegExp (/\#(.*?)$/);

		if (hash === 'chat/' + msg.src_id
			|| msg.src_id === user.id)
		{
			$(`<div class="comment">
			<div class="content">
				<a class="author"> `
				+ msg.src + `</a>
				<div class="metadata">
					<div class="date"> `
					+ 'now' + `</div></div>
				<div class="text">
					<p> ` + msg.text + `</p>
				</div>
			</div></div>
			`).appendTo('#msgs');
			}
		else
		{
			var button = [{
				addClass: 'btn btn-primary', text: 'X',
				onClick: function($noty){
					// 2eme listener window.location.href='#chat/' + id;
					$noty.close();
				}}];
			noty({text: msg.src
				+' t\'as envoye un msg : '
					+ msg.text,
				buttons: button});
		}

	});
};
