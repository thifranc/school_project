module.exports = {
	create:function(app, session)
	{
		var server = require('http').Server(app);
		var io = require('socket.io')(server);
		var sharedsession = require("express-socket.io-session");
		server.listen(1337);
		io.use(sharedsession(session, {autoSave:true}));
		return io;

	},
};
