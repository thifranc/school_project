var listenDelTag = function(){
		$('.tagged').off();
	$('.tagged').on('click', function(e){
		e.preventDefault();

		var self = this;
		var tag = $.trim($(this).text());

		$.ajax({
			type: 'DELETE',
			url: '/tags',
			data: {'tag':tag},
			dataType: 'json',
			encode: true
		})
			.done(function(res){
				if (res.status == 'success')
				{
					$(self).remove();

					$('<option value="' + tag+ '">'
						+ tag
							+ '</option>').appendTo('select');
				}
			});
	});

};

var listenDelImg = function(){
	$('img').on('click', function(e){
		e.preventDefault();
		var self = this;

		var src = $(this).attr('src');
		if (src == 'img/user.jpg')
			return ;
		$.ajax({
			type: 'DELETE',
			url: '/images',
			data: {'src':src},
			dataType: 'json',
			encode: true
		})
			.done(function(res){
				if (res.status == 'success')
					$(self).attr('src', 'img/user.jpg');
			});

	});

};

var listenImg = function(){
	$('#mainUp').on('change', function(e) {
		e.preventDefault();
		var file = $('#mainUp')[0].files[0];
		var formData = new FormData();
		formData.append('photo', file);
		formData.append('main', 'true');
		$.ajax({
			type: 'POST',
			url: '/images',
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			success: function(res){
				if (res.status == 'success')
					$('#img_main').attr('src', res.data.path);
			}
		});
	});    
	$('#imgUp').on('change', function(e) {
		e.preventDefault();
		var file = $('#imgUp')[0].files[0];
		var formData = new FormData();
		formData.append('photo', file);
		formData.append('main', 'false');
		$.ajax({
			type: 'POST',
			url: '/images',
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			success: function(res){
				if (res.status == 'success')
				{
					var flag = false;
					$(".imgMin").each(function() {
						if (flag === false
							&& this.src == 'http://localhost:1337/img/user.jpg')
						{
							this.src = res.data.path;
							flag = true;
						}
					});
				}
			}
		});
	});    
};

var listenSelf = function(){
	listenDelTag();
	listenDelImg();
	listenImg();


	$('#posUp').on('click', function(e){
		e.preventDefault();
		var options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		};
		var error = function(err) {
			console.log('ERROR(' + err.code + '): ' + err.message);
			if (err.code === 1)
				alert('You have to share location to update it');
			else
				alert('Could not get location -> ERROR(' + err.code + '): ' + err.message);
		};
		var success = function(pos) {
			var data = {
				latitude  : pos.coords.latitude,
				longitude : pos.coords.longitude
			};
			$.ajax({
				type        : 'POST',
				url         : '/self',
				data        : data,
				dataType    : 'json',
				encode          : true
			})
				.done(function(res) {
					errorHandle(res.message);
				});
		};
		navigator.geolocation.getCurrentPosition(success, error, options);
	});

	$('#saveData').on('click', function(e){
		e.preventDefault();
		var formData = {
			'prenom'         : $('#firstname').val(),
			'nom'            : $('#name').val(),
			'mail'           : $('#mail').val(),
			'age'            : $('#age').val(),
			'sex'            : $('#sex').val(),
			'looking'        : $('#looking').val(),
			'bio'            : $('#bio').val()
		};

		$.ajax({
			type: 'PATCH',
			url: '/self',
			data: formData,
			dataType: 'json',
			encode: true
		})
			.done(function(res){
				errorHandle(res.message);
			});
	});

	$('#subTags').on('click', function(e){
		e.preventDefault();
		var tags = $('#multi-select').val();

		$.ajax({
			type: 'PATCH',
			url: '/tags',
			data: {'tags':tags},
			dataType: 'json',
			encode: true
		})
			.done(function(res){
				if (res.status == 'success')
				{

					tags.forEach(function(tag){
						$('option[value='+tag+']').remove();
					})
					$('.ui.label.transition.visible').remove();

					tags.forEach(function(tag){

						$(`<button
							class="ui labeled icon yellow button tagged">
							<i class="remove icon"></i>`
							+ tag + '</button>').appendTo('#tags');
					})
					listenDelTag();
				}
			});
	});

	$('#creaTag').on('click', function(e){
		e.preventDefault();
		var tag = $('#newTag').val();
		console.log(tag);

		$.ajax({
			type: 'POST',
			url: '/tags',
			data: {'tag':tag},
			dataType: 'json',
			encode: true
		})
			.done(function(res){
				if (res.status == 'success')
				{
					alert(res.message);
					$('#newTag').val('');
					$('<option value="' + tag + '">'
						+ tag
							+ '</option>').appendTo('#multi-select');
				}
				else
					errorHandle(res.message);
			});
	});
};
