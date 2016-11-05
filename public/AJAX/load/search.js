var appendUserTags = function(tags){

	var string = '';
	if (tags[0] != null)
	{
		tags.every(function(tag, index){
			string = string
				+ '<div class="item">'
				+ tag
				+ '</div>';
			if (index === 4)
				return false;
			else
				return true;
		})
	}
	return string;
};

var appendUsers = function(users){
	users.forEach(function(user){
		var tags = appendUserTags(user.tags);
		$(`	<div class="ui five wide column">
			<div class="ui card">
				<div class="image">
					<a 	href="#profile/` + user.id + `" class="ui image">
						<img src="` + user.path + `">
					</a>
				</div>
				<div class="content">
					<div class="header"> `+ user.login + `
					</div>
					<div class="ui horizontal list">
						` + tags + `
					</div>
					<p>
						Gap : ` + Math.floor(user.gap / 1000) + `
					</p>
				</div>
			</div>
		</div>
		`).appendTo('#users');
	});
};

var unlistenSort = function(){
	$('#sortAgeUp').off();
	$('#sortAgeDown').off();
	$('#sortPopUp').off();
	$('#sortPopDown').off();
	$('#sortGapUp').off();
	$('#sortGapDown').off();
	$('#sortTagsUp').off();
	$('#sortTagsDown').off();
};

var loadSearch = function(users){
	$('#main').empty();

	var c = document.querySelector("#search");
	document.querySelector('#main').appendChild(c.content.cloneNode(true));
	if (users)
		appendUsers(users);
	$.ajax({
		type: 'GET',
		url: '/alltags',
		data: null,
		encode: true
	})
		.done(function(send){
			if (send.status == 'success')
				appendTags(send.data);
			else
				alert('Could not load tags');
		});

};
