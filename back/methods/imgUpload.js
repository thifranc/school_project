module.exports = {
	//curl -F "photo=@/nfs/2015/b/bchaleil/Downloads/real.jpg" -b "koa:sess=OI54nWWmVRbfyyrsQX1f-dDGSFyBXaRL" localhost:3000/api/users/images

	imgUpload: function(req, res)
	{
		var query_img = `
			INSERT INTO img ("user", path, main)
			values($(user), $(path), $(main))`;

		var query_right = `
			SELECT (
				SELECT
					COUNT(*) AS nb_main
					FROM img
					WHERE main='true'
					AND "user"=$(user)
					),(
				SELECT
					COUNT(*) AS nb_img
					FROM img
					WHERE main='false'
					AND "user"=$(user)
					)
			FROM img`;

		var fs = require('fs');
		var fileType = require('file-type');
		var uniq = require('uniqid');
		var allowed = ['jpg', 'jpeg', 'png'];

		var fd = req.file.buffer;
		var chunk = fd.slice(0, 262);
		var type = fileType(chunk);

		if (type && allowed.includes(type.ext))
		{
			var path = process.argv[1].split('/');
			path.pop();
			var id = uniq();
			var filename = (path.join('/'))
				+ '/public/img/'
				+ id
				+ '.' + type.ext;

			var params = {
				user: req.session.user_id,
				path: 'img/' + id + '.' + type.ext,
				main: req.body.main == 'true' ? true : false
			};

			req.db.any(query_right, params)

				.then(function(data){
					if (
						data[0] == null
						|| (req.body.main == 'true' && data[0].nb_main == 0)
						|| (req.body.main == 'false' && data[0].nb_img < 4)
						)
						return req.db.none(query_img, params);
					else
						throw 'Too many photo : 1 main 4 classic max';
				})

				.then(function(){
					fs.writeFile(filename, fd);
					var data = {
						status : 'success',
						message : 'Uploaded',
						data : {'path': params.path}
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
				message : 'File not good',
				data : null
			};
			res.send(data);
		}
	},

};
