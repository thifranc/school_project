module.exports = {

	search: function(req, res, next)
	{
		var regex = require('../traits/regex.js');
		var Promise = require("bluebird");

		var inject_sex = req.session.looking === 'both'
			? ''
			: 'AND sex=\'' + req.session.looking + '\'';

		var inject_tab = req.body.tags.length > 2
			? 'AND user_tags.tags=ANY(\'' + req.body.tags + '\'::text[])'
			: '';

		var query_img = `
			SELECT "user", path
			FROM img
			WHERE main=true
				AND "user"=$1
			LIMIT 1`;

		var query_search = `
			SELECT id, age, login, pop, array_agg(distinct user_tags.tags) AS tags,
				ST_Distance_Sphere(geom, $(geom)) AS gap
				FROM users
				FULL JOIN user_tags ON (user_tags."user"=users.id)
				FULL JOIN blocks ON (blocks.src=users.id)
				WHERE ST_Distance_Sphere(geom, $(geom))<$(gapMax)
					AND pop>=$(popMin)
					AND pop<=$(popMax)
					AND age>=$(ageMin)
					AND age<=$(ageMax)
					` + inject_sex +`
					` + inject_tab +`
					AND (looking='`+ req.session.sex +`' OR looking='both')
					AND (blocks.dest<>$(id) OR blocks.dest IS NULL)
					AND id!=`+ req.session.user_id +`
				GROUP BY id, age, login, pop
				ORDER BY 5, tags, pop DESC`;

		var query_common = `
			SELECT COUNT (*)
				FROM (
					SELECT tags
					FROM user_tags
					WHERE "user"=$1 OR "user"=$2
					GROUP BY tags
					HAVING COUNT(tags)>1)
				AS bonjour`;
		// if tabTags WHERE user_tags.tags=ANY('{lol, tg, mandarine}'::text[])
		//`user_tags.tags=ANY('{lol, tg, mandarine}'::text[])`


		var checkTags = function(string){
			if (!string)
				return (true);
			var regAlphanum = new RegExp('^[a-z\,\{\}]+$');
			return (regAlphanum.test(string));
		};
		if (checkTags(req.body.tags) === false)
		{
			var data = {
				status : 'fail',
				message : 'Tags are not all lowercase',
				data : null
			};
			res.send(data);
			return ;
		}

		var getIndexOf = function(tab, look){
			for (i=0 ; i < tab.length ; i++)
			{
				if (tab[i].id === look)
					return i;
			}
		}

		var result = new Object;
		var allData = {};

		req.body.id = req.session.user_id;
		req.body.geom = req.session.geom;

		req.db.any(query_search, req.body)

			.then(function(data){
				result = data;
				return Promise.map(data, function(elem){
					return req.db.any(query_img, elem.id);
				})
			})

			.then(function(paths){
				allData.paths = paths;
				return Promise.map(result, function(elem){
					return req.db.any(query_common, [req.session.user_id, elem.id]);
				});
			})

			.then(function(common){
				common.forEach(function(same, index){
					result[index].sameTags = parseInt(same[0].count);
				});

				allData.paths.forEach(function(path, i){

					if (path.length > 0)
					{
						var index = getIndexOf(result, path[0].user);
						result[index].path = path[0].path;
					}
					// put index of id in result
					else
						result[i].path = 'http://localhost:1337/img/user.jpg';
				})


				var data = {
					status : 'success',
					message : 'searched',
					data : result
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
