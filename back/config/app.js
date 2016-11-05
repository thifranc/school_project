module.exports = {

	create:function(session, db)
	{
		var app = require('express')();
		var express = require('express');
		app.use(express.static('public'));

		app.set('views', __dirname + '/../../views');
		app.set('view engine', 'jade');

		app.use(session);

		var bodyParser = require('body-parser');
		app.use(function(req, res, next) {
			if (!req.db)
				req.db = db;
			return next();
		});
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({extended : true}));
		return (app);
	},
};
