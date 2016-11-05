module.exports = {
//  curl -vH "Content-Type: application/json" -X POST -d '{"dest_id":999}' -b "COOKIE HERE" localhost:1337/view

	view: function(req, res, next)
	{
		var query_tag = `
			SELECT tags
			FROM user_tags
			WHERE "user"=$(dest)`;
		var query_img = `
			SELECT path, main
			FROM img
			WHERE img.user=$(dest)
			LIMIT 5`;
		var query_data = `
			SELECT id, ST_X(geom) AS longitude, ST_Y(geom) AS latitude, nom, prenom, login, age, sex, looking, last_log, pop, bio,
				EXISTS
					(SELECT id FROM users
					FULL JOIN likes ON (likes.src=users.id)
					WHERE likes.dest=$(dest) AND likes.src=$(src)
					LIMIT 1) AS liked,
				EXISTS
					(SELECT id FROM users
					FULL JOIN likes ON (likes.src=users.id)
					WHERE likes.dest=$(src) AND likes.src=$(dest)
					LIMIT 1) AS liked_you,
				EXISTS
					(SELECT id FROM users
					FULL JOIN blocks ON (blocks.src=users.id)
					WHERE blocks.dest=$(dest) AND blocks.src=$(src)
					LIMIT 1) AS blocked
			FROM users
			WHERE id=$(dest)
			LIMIT 1`;
		var query_view = `
			INSERT INTO views (src, dest)
			values($(src), $(dest))`;
		var query_followers = `
			SELECT DISTINCT ON (login)
				id, login,
				CASE
					WHEN (likes.dest=$(dest)) AND (views.dest=$(dest)) THEN 3
					WHEN (likes.dest=$(dest)) THEN 2
					WHEN (views.dest=$(dest)) THEN 1
					ELSE 0 END
			FROM users
			LEFT JOIN views ON (views.src=users.id)
			LEFT JOIN likes ON (likes.src=users.id)
			WHERE likes.dest=$(dest) OR views.dest=$(dest)
			ORDER BY login, 2 DESC`;
		var query_update_pop = `
			UPDATE users
			SET pop=
				(SELECT COUNT (*)
				FROM views
				WHERE dest=$1)
			WHERE id=$1`;

		var params = {
			src: req.session.user_id,
			dest: parseInt(req.params.id)
		};

		if (params.src !== params.dest)
		{
			req.db.one(query_data, params)

				.then(function(data){
					var all = {'user':data};
					return [all, req.db.any(query_followers, params)];
				})

				.spread(function(all, followers){
					all.followers = followers;
					return [all, req.db.any(query_img, params)];
				})

				.spread(function(all, img){
					all.img = img;
					return [all, req.db.any(query_tag, params)];
				})

				.spread(function(all, tags){
					all.tags = tags;
					return [all, req.db.none(query_view, params)];
				})

				.spread(function(all, img){
					var data = {
						status : 'success',
						message : 'Viewed',
						data : all
					};
					req.type = 'view';
					req.body.dest_id = params.dest;
					next();
					res.send(data);
					return req.db.none(query_update_pop, params.dest);
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
				message : 'Self view',
				data : null
			};
			res.send(data);
		}
	},
};
