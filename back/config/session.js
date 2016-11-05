module.exports = {

	create: function()
	{
		return (
			require('express-session')({
			secret: 'thifranc_secret',
			saveUninitialized: true,
			resave: true,
			secure: false
			})
		);
	}
};
