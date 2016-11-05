module.exports = {

	notifDelete: function(req, res)
	{

		var query_del_notif = `
			DELETE FROM notifs
			WHERE id=$1`;

		req.db.none(query_del_notif, req.body.id)

			.then(function(){
				var data = {
					status : 'success',
					message : 'Notif Deleted',
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
