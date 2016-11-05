module.exports = {

	notifGet: function(req, res)
	{
		var query_notifs = `
			SELECT *
			FROM notifs
			WHERE notifs.dest=$1
			ORDER BY notifs.date DESC;`;

		req.db.any(query_notifs, req.session.user_id)

			.then(function(notifs){
				var data = {
					status : 'success',
					message : 'Notifs Got',
					data : notifs
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
