module.exports = {

	is_valid: function(body)
	{
		var regex = require('../traits/regex.js');

		if (!body
			|| (body.bio && !regex.is_alphanum(body.bio)))
			return (false);
		if (	
				body.sex
				&& regex.is_age(body.age)
				&& regex.is_alphanum(body.nom)
				&& regex.is_alphanum(body.prenom)
				&& regex.is_alphanum(body.login)
				&& regex.is_mail(body.mail)
				&& regex.is_password(body.passwd)
		)
			return (true);
	},

	create: function(req, res)
	{
		var SHA256 = require("crypto-js/sha256");
		if (module.exports.is_valid(req.body))
		{
			if (!req.body.bio)
				req.body.bio = '';
			if (!req.body.looking)
				req.body.looking = 'both';
			req.body.passwd = SHA256(req.body.passwd).words[1].toString();
			module.exports.create_in_db(req, res);
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

	create_in_db: function(req, res)
	{
		var query_create =
			`INSERT INTO 
			users (nom, prenom, age, login, mail, passwd, sex, looking, bio, geom) 
			values(
				$(nom), $(prenom),
				$(age), $(login),
				$(mail), $(passwd),
				$(sex), $(looking),
				$(bio), ST_GeomFromText($(geom), 4326)
			)
			RETURNING id`;

			var geom = 'POINT(' + req.body.longitude + ' ' + req.body.latitude + ')';
			req.body.geom = geom;

		req.db.one(query_create, req.body)

			.then(function(data){
				req.session.user_id = data.id;
				req.session.looking = req.body.looking;
				req.session.sex = req.body.sex;
				req.session.login = req.body.login;
				req.session.geom = geom;
				var data = {
					status : 'success',
					message : 'Created',
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

	},

};
