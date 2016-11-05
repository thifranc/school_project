module.exports = {

	selfBasic: function(req, res)
	{

		var query_basic = `
			SELECT * FROM users
			WHERE id=$1
			LIMIT 1`;

		req.db.one(query_basic, req.session.user_id)

			.then(function(user){
				var data = {
					status : 'success',
					message : 'Data',
					data : user
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
