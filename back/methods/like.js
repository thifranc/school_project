module.exports = {
	//  curl -vH "Content-Type: application/json" -X POST -d '{"dest_id":777}' -b "COOKIE HERE" localhost:1337/view

	like: function(req, res, next)
	{
		var query_like = `
			INSERT INTO likes (src, dest)
			values($(src), $(dest))`;
		var query_match = `
			SELECT * FROM likes
			WHERE src=$(dest) AND dest=$(src)`;

		var params = {
			src: req.session.user_id,
			dest: req.body.dest_id
		};

		if (params.src === params.dest)
		{
			var data = {
				status : 'fail',
				message : 'self Like',
				data : null
			};
			res.send(data);
			return ;
		}

		req.db.none(query_like, params)

			.then(function(){
				return req.db.any(query_match, params);
			})

			.then(function(like){
				if (like.length > 0)
					req.type = 'match';
				else
					req.type = 'like';
				var data = {
					status : 'success',
					message : req.type,
					data : null
				};
				res.send(data);
				next();
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
