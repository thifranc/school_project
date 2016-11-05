module.exports = {

	is_valid: function(body)
	{
		var regex = require('../traits/regex.js');

		if (!body)
			return (false);
		if (
			body.sex
				&& regex.is_age(body.age)
				&& regex.is_alphanum(body.nom)
				&& regex.is_alphanum(body.prenom)
				&& regex.is_alphanum(body.bio)
				&& regex.is_mail(body.mail)
		)
			return (true);
	},

	posUpdate: function(req, res)
	{
		query_posUp = `
			UPDATE users
			SET geom=ST_GeomFromText($(geom), 4326)
			WHERE id=$(id)`;

		var params = {
			id : req.session.user_id,
			geom : 'POINT(' + req.body.longitude + ' ' + req.body.latitude + ')'
		};
		req.db.none(query_posUp, params)

			.then(function(){
				req.session.geom = params.geom;
				var data = {
					status : 'success',
					message : 'Pos Updated',
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

	selfUpdate: function(req, res)
	{
		query_selfUp = `
			UPDATE users
			SET prenom=$(prenom), nom=$(nom),
				mail=$(mail), age=$(age),
				sex=$(sex), looking=$(looking),
				bio=$(bio)
			WHERE id=$(id)`;

		req.body.id = req.session.user_id;

		if (module.exports.is_valid(req.body))
		{
			req.db.none(query_selfUp, req.body)

				.then(function(){
					req.session.looking = req.body.looking;
					req.session.sex = req.body.sex;
					var data = {
						status : 'success',
						message : 'Self Updated',
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
