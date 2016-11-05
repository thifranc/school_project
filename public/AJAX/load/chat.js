var appendMsgs = function(msgs, logins){
	msgs.forEach(function(msg){
		var login = msg.src == logins.user.id
							? logins.user.login
							: logins.dest.login;
		$(`<div class="comment">
			<div class="content">
				<a class="author"> `
				+ login + `</a>
				<div class="metadata">
					<div class="date"> `
					+ msg.date + `</div></div>
				<div class="text">
					<p> ` + msg.value + `</p>
				</div>
			</div></div>
			`).appendTo('#msgs');
	});
};

var loadChat = function(chat){
	$('#main').empty();
	var logins = {
		user : chat.user,
		dest : {'id': chat.dest.id,
				'login':chat.dest.login}
	};

	var c = document.querySelector("#chat");
	document.querySelector('#main').appendChild(c.content.cloneNode(true));

	if (chat.dest.path.length > 0)
		$('#imgMain').attr('src', chat.dest.path);
	$('#firstname').text('prenom : ' + chat.dest.prenom);
	$('#name').text('nom : ' + chat.dest.nom);
	$('#age').text('age : ' + chat.dest.age);
	$('#sex').text('sex : ' + chat.dest.sex);
	$('#looking').text('looking : ' + chat.dest.looking);
	appendMsgs(chat.msgs, logins);
};
