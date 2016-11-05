module.exports = {

	tagsCreate: function(req, res)
	{

		var regex = require('../traits/regex.js');
		var query_tag = `
			INSERT INTO tags (name) 
			values($1)`;

		if (regex.is_lowercase(req.body.tag))
		{
			req.db.none(query_tag, req.body.tag)

				.then(function(){
					var data = {
						status : 'success',
						message : 'Created Tags',
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
		}
		else
		{
			var data = {
				status : 'fail',
				message : 'Tag not lowercase',
				data : null
			};
			res.send(data);
		}
	},

	tagsGetAll: function(req, res)
	{
		var query_tag = `
		SELECT name
		FROM tags`;

		req.db.any(query_tag, req.session.user_id)

			.then(function(tags){
				var data = {
					status : 'success',
					message : 'Got Tags',
					data : tags
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

	tagsGet: function(req, res)
	{
		var query_tag = `
		SELECT name
		FROM tags
			FULL JOIN
				(
				SELECT * from user_tags
				WHERE "user"=$1
				)
				AS test
			ON (test.tags=tags.name)
		WHERE test."user" IS NULL`;

		req.db.any(query_tag, req.session.user_id)

			.then(function(tags){
				var data = {
					status : 'success',
					message : 'Got Tags',
					data : tags
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
