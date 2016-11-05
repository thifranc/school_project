
module.exports = {

	imgDelete:function(req, res)
	{
		var fs = require('fs');
		var query_delImg = `
			DELETE FROM img
			WHERE "user"=$(user) AND path=$(path)`;

		var params = {
			user : req.session.user_id,
			path : req.body.src
		};

		req.db.none(query_delImg, params)

			.then(function(){
				var data = {
					status : 'success',
					message : 'Img deleted',
					data : null
				};
				var path = process.argv[1].split('/');
				path.pop();
				var filename = (path.join('/'))
							+ '/public/'
							+ req.body.src;
				fs.unlink(filename, function(err){
					if (err)
						console.log(err);
					else
						console.log('file removed from server');
				});
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
