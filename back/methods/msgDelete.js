module.exports = {

	msgDelete: function(req, res)
	{

		var query_del_msg = `
			DELETE FROM msgs
			WHERE (src=$(src) AND dest=$(dest))
			OR (src=$(dest) AND dest=$(src))`;

		var params = {
			src: req.session.user_id,
			dest: req.body.dest_id
		};

		req.db.none(query_del_notif, params)

			.then(function(){
				var data = {
					status : 'success',
					message : 'Msg Deleted',
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
