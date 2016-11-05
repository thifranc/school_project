module.exports = {
// curl -vH "Content-Type: application/json" -X DELETE -d '{"dest_id":777}' -b "COOKIE HERE" localhost:1337/like
	unlike: function(req, res, next)
	{
		var query_unlike = `
			DELETE FROM likes
			WHERE src=$(src)
			AND dest=$(dest)`;

		var params = {
			src: req.session.user_id,
			dest: req.body.dest_id
		};

		req.db.none(query_unlike, params)

			.then(function(){
				var data = {
					status : 'success',
					message : 'Unliked',
					data : null
				};
				req.type = 'unlike';
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
