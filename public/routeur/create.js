var locate = new Object;
$.getJSON('https://geoip-db.com/json/geoip.php?jsonp=?') 
	.done (function(location) {
		locate.longitude = location.longitude;
		locate.latitude = location.latitude;
	});

var success = function(pos) {
	locate.longitude = pos.coords.longitude;
	locate.latitude = pos.coords.latitude;
	ajaxCall();
};

var error = function(err) {
	console.log('ERROR(' + err.code + '): ' + err.message);
	if (err.code === 1)
		ajaxCall();
	else
		alert('Could not get location -> ERROR(' + err.code + '): ' + err.message);
};

var options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
};

var ajaxCall = function(){

	var formData = {
		'login'          : $('#login').val(),
		'passwd'         : $('#passwd').val(),
		'prenom'         : $('#firstname').val(),
		'nom'            : $('#name').val(),
		'mail'           : $('#mail').val(),
		'age'            : $('#age').val(),
		'sex'            : $('#sex').val(),
		'looking'        : $('#looking').val(),
		'longitude'      : locate.longitude,
		'latitude'       : locate.latitude,
		'bio'            : $('#bio').val()
	};

	$.ajax({
		type        : 'POST',
		url         : '/create',
		data        : formData,
		dataType    : 'json',
		encode          : true
	})
		.done(function(res) {
			if (res.status == 'success')
				window.location = 'http://localhost:1337/login';
			else
				errorHandle(res.message);
		});
};

$(document).ready(function() {

	$('form').submit(function(event) {

		navigator.geolocation.getCurrentPosition(success, error, options);
		event.preventDefault();
	});

});
