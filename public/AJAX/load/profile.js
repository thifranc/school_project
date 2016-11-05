var displayMap = function(latitude, longitude) {
	var img = new Image();
	img.src = "https://maps.googleapis.com/maps/api/staticmap?center="
		+ latitude + "," + longitude
		+ "&zoom=13&size=300x300&sensor=false&markers=color:red%7C"
		+ latitude + "," + longitude;
	document.getElementById("map").appendChild(img);
};

var like = function(liked){
	if (liked)
	{
		$('#liked').attr('id', 'unlike');
		$('<i class="empty heart icon"></i>').appendTo('#unlike');
		$('#unlike').append('Unlike');
	}
	else
	{
		$('#liked').attr('id', 'like');
		$('<i class="heart icon"></i>').appendTo('#like');
		$('#like').append('Like');
	}
};

var block = function(blocked){
	if (blocked)
	{
		$('#blocked').attr('id', 'unblock');
		$('<i class="radio icon"></i>').appendTo('#unblock');
		$('#unblock').append('Unblock');
	}
	else
	{
		$('#blocked').attr('id', 'block');
		$('<i class="ban icon"></i>').appendTo('#block');
		$('#block').append('Block');
	}
};

var like_you = function(liked_you){
	if (liked_you)
	{
		$('<i class="heart icon"></i>').appendTo('#liked_you');
		$('#liked_you').append('Likes you');
	}
	else
	{
		$('<i class="empty heart icon"></i>').appendTo('#liked_you');
		$('#liked_you').append('No like');
	}
};

var chat = function(like, ekil, blocked, id){
	if (like && ekil && !blocked)
	{
		$('<div id=chat2 class="ui orange button"></i>').appendTo('#chatted');
		$('<i class="chat icon"></i>').appendTo('#chat2');
		$('#chat2').append('Chat');
		$('#chatted').on('click', function(){window.location.href='#chat/' + id;});
		//href to #chat/id
	}
};

var appendViewer = function(login, id){
	$('<p><a href="/#profile/'+id+'">'+login+'</a></p>').appendTo('#viewers');
};

var appendLiker = function(login, id){
	$('<p><a href="/#profile/'+id+'">'+login+'</a></p>').appendTo('#likers');
};

var loadProfile = function(profile){

	$('#main').empty();

	var p = document.querySelector("#profile");
	var td = p.content.querySelectorAll("p");
	var log = p.content.querySelector('#login');

	log.textContent = "Profile of " + profile.user.login;
	td[0].textContent = "Firstname : " + profile.user.prenom;
	td[1].textContent = "Name : " + profile.user.nom;
	td[2].textContent = "Age : " + profile.user.age;
	td[3].textContent = "Sex : " + profile.user.sex;
	td[4].textContent = "Looking : " + profile.user.looking;
	td[5].textContent = "Popularity : " + profile.user.pop;
	td[7].textContent = "Bio : " + profile.user.bio;

	document.querySelector('#main').appendChild(p.content.cloneNode(true));

	like(profile.user.liked);
	block(profile.user.blocked);
	like_you(profile.user.liked_you);
	chat(profile.user.liked, profile.user.liked_you,
		profile.user.blocked, profile.user.id);

	profile.img.forEach(function(img){
		if (img.main)
			$('#img_main').attr('src', img.path);
		else
			$(`<div class="ui four wide column">
					<div class="ui image">
				<img src="` + img.path + '">'
				+ '</div></div>').appendTo('#img');
	})
	socket.emit('logged', profile.user.id);
	socket.on('online', function(res){
		if (res)
			$('#online').text('Online');
		else
		{
			var lastLog = new Date(profile.user.last_log);
			var date = `${lastLog.getFullYear()}/${lastLog.getMonth()}/${lastLog.getDate()} at ${lastLog.getHours()}H`;
			$('#online').text('Last log : ' + date);
		}
	});
	profile.followers.forEach(function(follower){
		if (follower.case == 3)
		{
			appendViewer(follower.login, follower.id);
			appendLiker(follower.login, follower.id);
		}
		else if (follower.case == 2)
			appendLiker(follower.login, follower.id);
		else if (follower.case == 1)
			appendViewer(follower.login, follower.id);
	});

	displayMap(profile.user.latitude, profile.user.longitude);
};
