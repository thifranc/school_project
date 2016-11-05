module.exports = {

	notif: function(req, res)
	{
		var query_notif = `
			INSERT INTO notifs (src, dest, type, src_login) 
			values($(src), $(dest), $(type), $(src_login))`;
		var query_rights = `
			SELECT 
				EXISTS
					(SELECT *
					FROM blocks
					WHERE src=$(dest)
					AND dest=$(src)) AS blocked_me,
				EXISTS
					(SELECT *
					FROM blocks
					WHERE src=$(src)
					AND dest=$(dest)) AS blocked_by_me`;

		if (req.params.id)
			req.body.dest_id = req.params.id;
		var params = {
			src: req.session.user_id,
			src_login: req.session.login,
			dest: req.body.dest_id,
			type: req.type
		};

		req.db.one(query_rights, params)

		.then(function(right){
			if (
				right.blocked_me === true
				|| right.blocked_by_me === true)
				return ;
			else
				return req.db.none(query_notif, params);
		})

		.then(function(){
			console.log('Notif in Db');
		})

		.catch(function(err){
			console.log(err);
		});
	},
};
