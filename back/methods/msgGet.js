module.exports = {
//  curl -vH "Content-Type: application/json" -X POST -d '{"dest_id":999}' -b "COOKIE HERE" localhost:1337/block

	msgGet: function(req, res)
	{

		var query_get_msg = `
			SELECT * FROM msgs
			WHERE src=$(src) AND dest=$(dest)
			OR src=$(dest) AND dest=$(src)
			ORDER BY date`;
		var query_dest_data = `
			SELECT id, login, nom, prenom,
				age, sex, looking,
				CASE
					WHEN main=true THEN path
					ELSE NULL
				END AS path
			FROM users
			FULL JOIN img ON (img."user"=users.id)
			WHERE id=$(dest)
			ORDER BY 8
			LIMIT 1`;


		var params = {
			src: req.session.user_id,
			dest: req.params.id
		};

		var me = {
			login : req.session.login,
			id: req.session.user_id
		};

		if (params.src === params.dest)
		{
			var data = {
				status : 'fail',
				message : 'self Chat',
				data : null
			};
			res.send(data);
			return ;
		}

		req.db.one(query_dest_data, params)

			.then(function(data){
				return [data, req.db.any(query_get_msg, params)];
			})
		
			.spread(function(data, msgs){
				var data = {
					status : 'success',
					message : 'Got Msgs',
					data : {'msgs':msgs, 'dest':data,
						'user':me}
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
