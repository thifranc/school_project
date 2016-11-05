module.exports = {

	selfDelete: function(req, res)
	{

		var query_del_user = `
			DELETE FROM users
			WHERE id=$1`;

		req.db.none(query_del_user, req.session.user_id)

			.then(function(){
				var data = {
					status : 'success',
					message : 'Self Deleted',
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
};
