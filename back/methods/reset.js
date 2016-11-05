module.exports = {

	reset: function(req, res)
	{
		var regex = require('../traits/regex.js');
		var SHA256 = require("crypto-js/sha256");


		var query_set_new_passwd = `
			UPDATE users
			SET passwd=$(new_passwd)
			WHERE login=$(login)
			AND tmp_passwd=$(tmp_passwd)
			RETURNING *`;
		var query_del_tmp_passwd = `
			UPDATE users
			SET tmp_passwd=NULL
			WHERE login=$(login)
			AND tmp_passwd=$(tmp_passwd)`;

		if (req.body.new_passwd
			&& regex.is_password(req.body.new_passwd))
		{
			req.body.new_passwd = SHA256(req.body.new_passwd).words[1].toString();
			req.db.any(query_set_new_passwd, req.body)

				.then(function(user){
					return [user, req.db.none(query_del_tmp_passwd, req.body)];
				})

				.spread(function(user){
					if (user[0])
					{
						var data = {
							status : 'success',
							message : 'Reset',
							data : null
						};
						res.send(data);
					}
					else
					{
						var data = {
							status : 'fail',
							message : 'Wrong data',
							data : null
						};
						res.send(data);
					}
				})

				.catch(function(err){
					var data = {
						status : 'fail',
						message : 'catched',
						data : null
					};
					res.send(data);
				});
		}
		else
		{
			var data = {
				status : 'fail',
				message : 'New password incorrect',
				data : null
			};
			res.send(data);
		}
	},
};
