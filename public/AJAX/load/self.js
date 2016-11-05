
var appendTags = function(tags){

	$('#multi-select').empty();

	tags.forEach(function(tag){
		$('<option value="' + tag.name + '">'
			+ tag.name
				+ '</option>').appendTo('#multi-select');
	})
};

var loadSelf = function(self){

	$('#main').empty();

	var selfElem = document.querySelector("#self");
	var p = selfElem.content.querySelectorAll("p");
	var log = selfElem.content.querySelector('#login');

	log.textContent = "Profile of " + self.data.login;
	p[0].textContent = "Firstname : ";
	p[1].textContent = "Name : ";
	p[2].textContent = "Age : ";
	p[3].textContent = "Mail : ";
	p[4].textContent = "Sex : ";
	p[5].textContent = "Looking : ";
	p[6].textContent = "Popularity : " + self.data.pop;
	p[7].textContent = "Bio : ";

	document.querySelector('#main').appendChild(selfElem.content.cloneNode(true));

	$('#firstname').attr('value', self.data.prenom);
	$('#name').attr('value', self.data.nom);
	$('#age').attr('value', self.data.age);
	$('#mail').attr('value', self.data.mail);
	$('#sex').val(self.data.sex);
	$('#looking').val(self.data.looking);
	$('#bio').val(self.data.bio);


	self.tags.forEach(function(tag){
		$(`<button class="ui labeled icon yellow button tagged">
			<i class="remove icon"></i>`
			+ tag.tags + '</button>').appendTo('#tags');
	})

	self.img.forEach(function(img, i){
		if (img.main)
			$('#img_main').attr('src', img.path);
		else
		{
			var flag = false;
			$(".imgMin").each(function() {
				if (flag === false
					&& this.src == 'http://localhost:1337/img/user.jpg')
				{
					this.src = img.path;
					flag = true;
				}
			});
		}
	})

	self.followers.forEach(function(follower){
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

	$.ajax({
		type: 'GET',
		url: '/tags',
		data: null,
		encode: true
	})
		.done(function(res){
			if (res.status == 'success')
				appendTags(res.data);
			else
				errorRedirect(res.message);
		});

};
