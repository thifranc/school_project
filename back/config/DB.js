const promise = require('bluebird');
module.exports = {

	create: function()
	{
		var pgp = require('pg-promise')({promiseLib: promise});

		var os = process.platform;
		var config = {

			host: os === 'darwin' ? '192.168.99.100' : 'localhost',
			port: 5432,
			database: 'matcha',
			user: 'postgres',
			password: 'lol'
		};
		pgp.pg.types.setTypeParser(1114, str => str);

		return (pgp(config));
	},

};
