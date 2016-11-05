$.noty.defaults = {
	layout: 'topRight',
	theme: 'defaultTheme',
	type: 'alert',
	text: '',
	dismissQueue: true,
	template: `<div class="noty_message">
					<span class="noty_text"></span>
					<div class="noty_close"></div>
					</div>`,
		animation: {
			open: {height: 'toggle'},
			close: {height: 'toggle'},
			easing: 'swing',
			speed: 500
		},
	timeout: false,
	force: false,
	modal: false,
	maxVisible: 5,
	killer: false,
	closeWith: [],
	callback: {
		onShow: function() {},
		afterShow: function() {},
		onClose: function() {},
		afterClose: function() {},
		onCloseClick: function() {},
	},
	buttons: false
};
