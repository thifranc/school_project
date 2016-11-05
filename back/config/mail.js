module.exports = {

	create: function()
	{
		var nodemailer = require('nodemailer');
		var transporter = nodemailer.createTransport('smtps://8f5bb829c1f4b5563587e326c1a7dbbb:688d82fcdd811239ab4ec4a81bc97372@in-v3.mailjet.com');
		return (transporter);
	}

};
