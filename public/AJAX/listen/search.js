var listenSearch = function(){
	$('#searching').on('click', function(e){
		e.preventDefault();
		var data = {
			tags   : '{' + $('#multi-select').val() + '}',
			ageMin : $('#ageMin').val(),
			ageMax : $('#ageMax').val(),
			popMin : $('#popMin').val(),
			popMax : $('#popMax').val(),
			gapMax : $('#gapMax').val() * 1000
		};
			$.ajax({
				type        : 'POST',
				url         : '/search',
				data        : data,
				dataType    : 'json',
				encode      : true
			})
				.done(function(res) {
					if (res.status == 'success')
					{
						unlistenSort();
						loadSearch(res.data);
						listenSearch();
						listenSort(res.data);
					}
					else
						errorHandle(res.message);
				});
	});
};

var listenSort = function(users){
	$('#sortAgeUp').on('click', function(e){
		$('#users').empty();
		users.sort(function(a, b){
			return a.age < b.age ? -1 : 1;
		});
		appendUsers(users);
	});
	$('#sortAgeDown').on('click', function(e){
		$('#users').empty();
		users.sort(function(a, b){
			return a.age < b.age ? 1 : -1;
		});
		appendUsers(users);
	});
	$('#sortPopUp').on('click', function(e){
		$('#users').empty();
		users.sort(function(a, b){
			return a.pop < b.pop ? -1 : 1;
		});
		appendUsers(users);
	});
	$('#sortPopDown').on('click', function(e){
		$('#users').empty();
		users.sort(function(a, b){
			return a.pop < b.pop ? 1 : -1;
		});
		appendUsers(users);
	});
	$('#sortGapUp').on('click', function(e){
		$('#users').empty();
		users.sort(function(a, b){
			return a.gap < b.gap ? -1 : 1;
		});
		appendUsers(users);
	});
	$('#sortGapDown').on('click', function(e){
		$('#users').empty();
		users.sort(function(a, b){
			return a.gap < b.gap ? 1 : -1;
		});
		appendUsers(users);
	});
	$('#sortTagsUp').on('click', function(e){
		$('#users').empty();
		users.sort(function(a, b){
			return a.sameTags < b.sameTags ? -1 : 1;
		});
		appendUsers(users);
	});
	$('#sortTagsDown').on('click', function(e){
		$('#users').empty();
		users.sort(function(a, b){
			return a.sameTags < b.sameTags ? 1 : -1;
		});
		appendUsers(users);
	});
};

