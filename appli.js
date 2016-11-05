
var db = require('./back/config/DB.js').create();
var session = require('./back/config/session.js').create();
var app = require('./back/config/app.js').create(session, db);
var io = require('./back/config/io.js').create(app, session);

var regex = require('./back/traits/regex.js');

var API = require('./back/API.js').API;

API(app);

app
//display routes
//no header
	.get('/reset/:token', function(req, res){res.render('reset');})
	.get('/create', function(req, res){res.render('create');})
	.get('/', function(req, res){res.render('header');})
	.get('/login', function(req, res){res.render('login');})

db.connect()
	.then(sco=> {
		sco.client.on('notification', data => {
			var info = JSON.parse(data.payload);
			var dests = clients[info.dest];
			if (dests)
			{
				dests.forEach(function(dest){
					io.to(dest).emit('ser_notif',
						{'src_login':info.src_login, 'type':info.type, 'id':info.id});
				});
			}
		});
		sco.none('LISTEN $1~', 'my-channel');
	})
	.catch(err=> {
		console.log('Error:', err);
	});

var sendMsgToAllDest = function(io, socket, dests, msg){
	if (dests)
	{
		dests.forEach(function(dest){
			io.to(dest).emit('ser_msg', {"src":socket.handshake.session.login,
				"dest":msg.dest, "text":msg.text, "src_id":socket.handshake.session.user_id});
		});
	}
};

var msgToDB = function(msg, src)
{
	var query_msg = `
		INSERT INTO msgs (dest, src, value)
		values($(dest), $(src), $(value))`;

	var params = {
		dest : msg.dest.id,
		src  : src,
		value: msg.text
	};

	db.none(query_msg, params);
};

var clients = [];
io.on('connection', function (socket) {

	//keep log of all clients in order to chat with websocket
	if (socket.handshake.session.user_id)
	{
		if (clients[socket.handshake.session.user_id])
			clients[socket.handshake.session.user_id].push(socket.id);
		else
		{
			clients[socket.handshake.session.user_id] = [];
			clients[socket.handshake.session.user_id].push(socket.id);
		}
	}

	socket.on('cli_msg', function(msg){
		if (!regex.is_alphanum(msg.text))
			return ;
		var dests = clients[msg.dest.id];
		var srcs = clients[socket.handshake.session.user_id];
		sendMsgToAllDest(io, socket, dests, msg);
		sendMsgToAllDest(io, socket, srcs, msg);
		msgToDB(msg, socket.handshake.session.user_id);
	});

	socket.on('blocked', function(data){
		if (clients[data.dest])
		{
			clients[data.dest].forEach(function(dest){
				io.to(dest).emit('close_me', 1);
			});
		}
	});

	socket.on('leave', function(data){
		var id = '/#' + data.socket;
		var login = socket.handshake.session.user_id;
		if (clients[login])
			clients[login].splice(clients[login].indexOf(id), 1);
	});
	socket.on('logged', function(id){
		if (clients[id] && clients[id].length)
			socket.emit('online', true);
		else
			socket.emit('online', false);
	});
});
