module.exports = {
//  curl -vH "Content-Type: application/json" -X POST -d '{"login":"pl", "passwd":"moiMOI123"}' localhost:1337/login 
	login: function(req, res)
	{
		var regex = require('../traits/regex.js');
		var SHA256 = require("crypto-js/sha256");
		var CryptoJS = require("crypto-js");

		var query_login = `
			SELECT * FROM users 
			WHERE login=$(login)
			AND passwd=$(passwd)
			LIMIT 1`;
		var query_update_last_log = `
			UPDATE users SET last_log=CURRENT_TIMESTAMP
			WHERE id=$1`;

		if (regex.is_alphanum(req.body.login
			&& regex.is_password(req.body.passwd)))
		{
			req.body.passwd = SHA256(req.body.passwd).words[1].toString();
			req.db.one(query_login, req.body)

				.then(function(user){
					var id = user.id;
					req.session.user_id = user.id;
					req.session.looking = user.looking;
					req.session.sex = user.sex;
					req.session.login = user.login;
					req.session.geom = user.geom;
					return [user, req.db.none(query_update_last_log, user.id)];
				})

				.spread(function(user){
					var data = {
						status : 'success',
						message : 'Logged',
						data : {'user':user}
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
