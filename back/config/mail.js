module.exports = {

	create: function()
	{
		var nodemailer = require('nodemailer');
		nodemailer.sendmail = true;
		var transporter = nodemailer.createTransport({service: 'Hotmail',
			auth: {
				user: 'matcha.matcha@outlook.com',
				pass: 'moiMOI123'
			},
		});
		return (transporter);
	}

};
