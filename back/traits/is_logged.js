module.exports = {

	is_logged: function(req, res, next)
	{
		if (req.session.login
			&& req.session.user_id
			&& req.session.looking)
			next();
		else
		{
			var data = {
				status : 'fail',
				message : 'Not logged in',
				data : null
			};
			res.send(data);
		}
	}
};
