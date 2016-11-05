
module.exports = {

	API: function(app)
	{
		var multer = require('multer');

		const storage = multer.memoryStorage();
		const upload = multer({ storage: storage })

		var ft = require('./config/methods.js');
		app
		// Unauthenticated action
			.post('/login', ft.login)
			.post('/create', ft.midCreate.create)
			.post('/reset', ft.reset)
			.post('/forget', ft.forget)


		// Action on self
			.get('/logout', ft.is_logged, ft.logout)

			.get('/selfBasic', ft.is_logged, ft.selfBasic)
			.get('/self', ft.is_logged, ft.selfData)
			.patch('/self', ft.is_logged, ft.selfUpdate)
			.delete('/self', ft.is_logged, ft.selfDelete)
			.post('/self', ft.is_logged, ft.posUpdate)

			.post('/images', ft.is_logged,
				upload.single('photo'), ft.imgUpload)
			.delete('/images', ft.is_logged, ft.imgDelete)

			.delete('/notif', ft.is_logged, ft.notifDelete)
			.get('/notif', ft.is_logged, ft.notifGet)

			.get('/tags', ft.is_logged, ft.midTags.tagsGet)
			.get('/alltags', ft.is_logged, ft.midTags.tagsGetAll)
			.patch('/tags', ft.is_logged,
				ft.midUsertags.tagSub)
			.delete('/tags', ft.is_logged,
				ft.midUsertags.tagUnsub)


		// Interract with other users
			.post('/like', ft.is_logged, ft.authorize,
				ft.like, ft.notif)
			.delete('/like', ft.is_logged, ft.authorize,
				ft.unlike, ft.notif)

			.post('/block', ft.is_logged, ft.authorize,
				ft.block, ft.notif)
			.delete('/block', ft.is_logged,
				ft.unblock, ft.notif)

			.get('/profile/:id', ft.is_logged, ft.view, ft.notif)
			.get('/chat/:id', ft.is_logged, ft.authorize,
				ft.canChat,	ft.msgGet)
			.post('/search', ft.is_logged, ft.search)


		// Interact with admin
			.post('/report', ft.is_logged, ft.report)
			.post('/tags', ft.is_logged, ft.midTags.tagsCreate)
	},

};
