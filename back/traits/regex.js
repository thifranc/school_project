module.exports = {

	is_alphanum: function(string){
		if (!string)
			return (false);
		var regAlphanum = new RegExp('^[ ?!\,\.0-9a-z\_\-]+$','i');
		return (regAlphanum.test(string));
	},

	is_mail: function(string){
		if (!string)
			return (false);
		var regEmail = new RegExp('^[0-9a-z.\_\-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
		return (regEmail.test(string));
	},

	is_lowercase: function(string){
		if (!string)
			return (false);
		var regEmail = new RegExp('^[a-z]+$');
		return (regEmail.test(string));
	},

	is_password: function(string){
		if (!string)
			return (false);
		var regPasswd = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$');
		return (regPasswd.test(string));
	},

	is_age: function(string){
		if (!string)
			return (false);
		var regAge = new RegExp('^[0-9]{1,2}$');
		return (regAge.test(string));
	},

};
