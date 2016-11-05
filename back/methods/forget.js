module.exports = {

//curl -vH "Content-Type: application/json" -X POST -d '{"login":'$1'}' -b "$1" localhost:1337/forget

	forget: function(req, res)
	{
		var tmp_passwd = require('uniqid')();
		var regex = require('../traits/regex.js');

		var query_mail = `
			SELECT mail, id
			FROM users
			WHERE login=$1`;
		var query_set_tmp_passwd = `
			UPDATE users
			SET tmp_passwd=$(tmp_passwd)
			WHERE id=$(id)`;

		if (req.body.login
			&& regex.is_alphanum(req.body.login))
		{
			req.db.one(query_mail, req.body.login)

				.then(function(user){
					var transporter = require('../config/mail.js').create();
					var params = {
						id : user.id,
						tmp_passwd: tmp_passwd
					};
					var mailOptions = {
						from: `"resp Matcha 👥"
							<thibault.francois@hotmail.com>`,
						to: user.mail,
						subject: 'Reset password',
						html: 'Hi ' + req.body.login
							+' ! Your tmp_passwrd is '
							+ tmp_passwd
							+ '  go to /reset/'
							+ tmp_passwd
					};
					transporter.sendMail(mailOptions);
					return req.db.none(query_set_tmp_passwd, params);
				})

				.then(function(){
					var data = {
						status : 'success',
						message : 'Mailed',
						data : null
					};
					res.send(data);

				})

				.catch(function(err){
					var data = {
						status : 'fail',
						message : err,
						data : null
					};
					res.send(data);
				});
		}
		else
		{
			var data = {
				status : 'fail',
				message : 'Data not correctly entered',
				data : null
			};
			res.send(data);
		}
	},
};
