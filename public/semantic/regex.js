var is_alphanum = function(string){
	if (!string)
		return (false);
	var regAlphanum = new RegExp('^[0-9a-z\_\-]+$','i');
	return (regAlphanum.test(string));
};

var is_mail = function(string){
	if (!string)
		return (false);
	var regEmail = new RegExp('^[0-9a-z.\_\-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
	return (regEmail.test(string));
};

var is_lowercase = function(string){
	if (!string)
		return (false);
	var regEmail = new RegExp('^[a-z]+$');
	return (regEmail.test(string));
};

var is_password = function(string){
	if (!string)
		return (false);
	var regPasswd = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$');
	return (regPasswd.test(string));
};

var is_age = function(string){
	if (!string)
		return (false);
	var regAge = new RegExp('^[0-9]{1,2}$');
	return (regAge.test(string));
};

var errorHandle = function(msg){
	if (msg.detail != null)
		alert('Error : ' + msg.detail);
	else if (msg.message != null)
		alert('Error : ' + msg.message);
	else
		alert(msg);
};

var errorRedirect = function(msg){
	if (msg === "Not logged in")
		window.location = 'http://localhost:1337/login';
	else
		window.location = 'http://localhost:1337/';
	if (msg.detail != null)
		alert('Error : ' + msg.detail);
	else if (msg.message != null)
		alert('Error : ' + msg.message);
	else
		alert(msg);
};
