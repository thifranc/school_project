module.exports = {

	authorize: function(req, res, next)
	{
		var query_rights = `
			SELECT COUNT(*) AS img,
				EXISTS
					(SELECT *
					FROM blocks
					WHERE src=$(dest)
					AND dest=$(src)) AS blocked_me,
				EXISTS
					(SELECT *
					FROM blocks
					WHERE src=$(src)
					AND dest=$(dest)) AS blocked_by_me
			FROM img
			WHERE "user" = $(src)`;

		if (req.params.id)
			req.body.dest_id = req.params.id;
		var params = {
			src: req.session.user_id,
			dest: req.body.dest_id
		};

		req.db.one(query_rights, params)

			.then(function(right){
				if (right.img == 0
					|| right.blocked_me === true
					|| right.blocked_by_me === true)
				{
					var data = {
						status : 'fail',
						message : 'Not enough rights',
						data : null
					};
					res.send(data);
				}
				else
					next();
			})
	},

	chat: function(req,res, next)
	{
		var query_rights = `
			SELECT 
				EXISTS
					(SELECT *
					FROM likes
					WHERE src=$(dest)
					AND dest=$(src)) AS liked_me,
				EXISTS
					(SELECT *
					FROM likes
					WHERE src=$(src)
					AND dest=$(dest)) AS liked_by_me`;

		var params = {
			src: req.session.user_id,
			dest: req.body.dest_id
		};

		req.db.one(query_rights, params)

			.then(function(right){
				if (
					right.liked_me === false
					|| right.liked_by_me === false)
				{
					var data = {
						status : 'fail',
						message : 'Not matched',
						data : null
					};
					res.send(data);
				}
				else
					next();
			})
	}
};
