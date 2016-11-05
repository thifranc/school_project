module.exports = {
// curl -vH "Content-Type: application/json" -X DELETE -d '{"dest_id":999}' -b "COOKIE HERE" localhost:1337/block
	unblock: function(req, res, next)
	{
		var query_unblock = `
			DELETE FROM blocks
			WHERE src=$(src)
			AND dest=$(dest)`;

		var params = {
			src: req.session.user_id,
			dest: req.body.dest_id
		};

		req.db.none(query_unblock, params)

			.then(function(){
				var data = {
					status : 'success',
					message : 'Unblocked',
					data : null
				};
				req.type = 'unblock';
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
