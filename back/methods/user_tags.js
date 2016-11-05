module.exports = {

	tagSub: function(req, res)
	{
		var Promise = require("bluebird");

		var id = req.session.user_id;
		var query_tag = `
			INSERT INTO user_tags ("user", tags) 
			values($1, $2)`;

		Promise.map(req.body.tags, function(tag){
			return req.db.none(query_tag, [id, tag]);
		})

			.then(function(){
				var data = {
					status : 'success',
					message : 'User Tag Linked',
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

	tagUnsub: function(req, res){
	
		var query_Unsub = `
			DELETE FROM user_tags
			WHERE "user"=$(id)
			AND tags=$(tags)`;

		var params = {
			id : req.session.user_id,
			tags : req.body.tag
		};

		req.db.none(query_Unsub, params)

			.then(function(){
				var data = {
					status : 'success',
					message : 'Tag Deleted',
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
