module.exports = {

	selfData: function(req, res)
	{

		var query_tags = `
			SELECT tags
			FROM user_tags
			WHERE "user"=$1`;
		var query_data = `
			SELECT * FROM users
			WHERE id=$1
			LIMIT 1`;
		var query_update_pop = `
			UPDATE users
			SET pop=
				(SELECT COUNT (*)
				FROM views
				WHERE dest=$1)
			WHERE id=$1`;
		var query_img = `
			SELECT path, main
			FROM img
			WHERE img.user=$1
			LIMIT 5`;
		var query_followers = `
			SELECT DISTINCT ON (login)
				id, login,
				CASE
					WHEN (likes.dest=$1) AND (views.dest=$1) THEN 3
					WHEN (likes.dest=$1) THEN 2
					WHEN (views.dest=$1) THEN 1
					ELSE 0 END
			FROM users
			LEFT JOIN views ON (views.src=users.id)
			LEFT JOIN likes ON (likes.src=users.id)
			WHERE likes.dest=$1 OR views.dest=$1
			ORDER BY login, 2 DESC`;

		req.db.none(query_update_pop, req.session.user_id)

			.then(function(){
				return req.db.one(query_data, req.session.user_id);
			})

			.then(function(data){
				var all = {'data':data};
				return [all, req.db.any(query_img, req.session.user_id)];
			})

			.spread(function(all, img){
				all.img = img;
				return [all, req.db.any(query_tags, req.session.user_id)];
			})

			.spread(function(all, tags){
				all.tags = tags;
				return [all, req.db.any(query_followers, req.session.user_id)];
			})

			.spread(function(all, followers){
				all.followers = followers;
				var data = {
					status : 'success',
					message : 'Data grepped',
					data : all
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
