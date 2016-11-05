var ash = new RegExp (/\#(.*?)$/);

window.onbeforeunload = function(ev){
	socket.emit('leave', {'socket':socket.id});
};

window.onhashchange = function(e){
	var test_hash = e.newURL.match(ash);
	if (test_hash)
	{
		var hash = test_hash[1];
		getProfile(hash);
		getSelf(hash);
		getChat(hash);
	}
	else
		getSearch();
};

$().ready(function(){
	if (self.document.location.hash)
	{
		var hash = self.document.location.hash.match(ash)[1];
		getProfile(hash);
		getSelf(hash);
		getChat(hash);
	}
	else
		getSearch();
})

var getSearch = function(hash){
	$.ajax({
		type        : 'POST',
		url         : '/search',
		data        : {'tags':'', 'ageMin':0, 'ageMax':99,
			'popMin':0, 'popMax':9000, 'gapMax':99000000},
		dataType    : 'json',
		encode      : true
	})
		.done(function(res) {
			if (res.status == 'success')
			{
				loadSearch(res.data);
				listenSearch();
				listenSort(res.data);
			}
			else
				errorRedirect(res.message);
		});
};

var getChat = function(hash){
	if (hash.search('chat') != -1)
	{
		var id = hash.match(/\/(.*?)$/)[1];
		$.ajax({
			type        : 'GET',
			url         : '\/' + hash,
			data        : null,
			dataType    : 'json',
			encode      : true
		})
			.done(function(res) {
				if (res.status == 'success')
				{
					loadChat(res.data);
					var dest = {
						'login' : res.data.dest.login,
						'id'    : res.data.dest.id
					};
					listenChat(dest);
				}
				else
					errorRedirect(res.message);
			});
	}
};

var getProfile = function(hash){
	if (hash.search('profile') != -1)
	{
		var id = hash.match(/\/(.*?)$/)[1];
		$.ajax({
			type        : 'GET',
			url         : '\/' + hash,
			data        : null,
			dataType    : 'json',
			encode      : true
		})
			.done(function(res) {
				if (res.status == 'success')
				{
					loadProfile(res.data);
					listenProfile();
				}
				else
					errorRedirect(res.message);
			});
	}
};

var getSelf = function(hash){
	if (hash == "self")
	{
		$.ajax({
			type        : 'GET',
			url         : '/self',
			data        : null,
			dataType    : 'json',
			encode      : true
		})
			.done(function(res) {
				if (res.status == 'success')
				{
					loadSelf(res.data);
					listenSelf();
				}
				else
					errorRedirect(res.message);
			});
	}

};
