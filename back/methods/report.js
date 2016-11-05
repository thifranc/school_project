module.exports = {

	report: function(req, res)
	{
		var transporter = require('../config/mail.js').create();
		var mailOptions = {
			from: '"Automatic Send " <thibault.francois@hotmail.com>',
			to: 'thifranc@student.42.fr',
			subject: 'User report',
			html: 'Hi your user : '
				+ req.session.user_id
				+ '  with login : '
				+ req.session.login
				+ 'reported user : '
				+ req.body.dest_id
		};
		transporter.sendMail(mailOptions);
		var data = {
			status : 'success',
			message : 'Reported',
			data : null
		};
		res.send(data);
	},
};
