
module.exports = {

	is_logged: require('../traits/is_logged.js').is_logged,
	authorize: require('../methods/authorize.js').authorize,
	canChat: require('../methods/authorize.js').chat,
	login: require('../methods/login.js').login,
	logout: require('../methods/logout.js').logout,


	midCreate: require('../methods/create.js'),
	forget: require('../methods/forget.js').forget,
	reset: require('../methods/reset.js').reset,


	posUpdate: require('../methods/selfUpdate.js').posUpdate,
	selfBasic: require('../methods/selfBasic.js').selfBasic,
	selfData: require('../methods/selfData.js').selfData,
	selfUpdate: require('../methods/selfUpdate.js').selfUpdate,
	selfDelete: require('../methods/selfDelete.js').selfDelete,
	imgUpload: require('../methods/imgUpload.js').imgUpload,
	imgDelete: require('../methods/imgDelete.js').imgDelete,


	block: require('../methods/block.js').block,
	unblock: require('../methods/unblock.js').unblock,

	like: require('../methods/like.js').like,
	unlike: require('../methods/unlike.js').unlike,

	view: require('../methods/view.js').view,
	search: require('../methods/search.js').search,

	notif: require('../methods/notif.js').notif,

	report: require('../methods/report.js').report,

	notifDelete: require('../methods/notifDelete.js').notifDelete,
	notifGet: require('../methods/notifGet.js').notifGet,

	msgDelete: require('../methods/msgDelete.js').msgDelete,
	msgGet: require('../methods/msgGet.js').msgGet,

	midTags: require('../methods/tags.js'),
	midUsertags: require('../methods/user_tags.js'),
};
