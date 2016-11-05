module.exports = {
//  curl -vH "Content-Type: application/json" -X POST -d '{"dest_id":999}' -b "COOKIE HERE" localhost:1337/block

	block: function(req, res, next)
	{

		var query_block = `
			INSERT INTO blocks (src, dest) 
			values($(src), $(dest))`;

		var params = {
			src: req.session.user_id,
			dest: req.body.dest_id
		};

		if (params.src === params.dest)
		{
			var data = {
				status : 'fail',
				message : 'self Block',
				data : null
			};
			res.send(data);
			return ;
		}

		req.db.none(query_block, params)

			.then(function(){
				var data = {
					status : 'success',
					message : 'Blocked',
					data : null
				};
				req.type = 'block';
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
