var listenLike = function(id){
	if ($('#like').length != 0)
	{
		$('#like').on('click', function(){
			$.ajax({
				type        : 'POST',
				url         : '/like',
				data        : {'dest_id':id},
				dataType    : 'json',
				encode      : true
			})
				.done(function(res) {
					if (res.status == 'success')
					{
						$('#like').empty();
						$('#like').off('click');
						$('#like').attr('id', 'liked');
						like(true);
						listenLike(id);
						if (res.message == 'match')
							chat(1, 1, 0, id);
					}
					else
						errorHandle(res.message);
				});
		})
	}
	else if ($('#unlike').length != 0)
	{
		$('#unlike').on('click', function(){
			$.ajax({
				type        : 'DELETE',
				url         : '/like',
				data        : {'dest_id':id},
				dataType    : 'json',
				encode      : true
			})
				.done(function(res) {
					if (res.status == 'success')
					{
						socket.emit('blocked', {dest:id});
						$('#unlike').empty();
						$('#unlike').off('click');
						$('#unlike').attr('id', 'liked');
						like(false);
						listenLike(id);
						if ($('#chat2').length)
							$('#chat2').remove();
					}
					else
						errorHandle(res.message);
				});
		})
	}
};

var listenBlock = function(id){
	if ($('#block').length != 0)
	{
		$('#block').on('click', function(){
			$.ajax({
				type        : 'POST',
				url         : '/block',
				data        : {'dest_id':id},
				dataType    : 'json',
				encode      : true
			})
				.done(function(res) {
					if (res.status == 'success')
					{
						socket.emit('blocked', {dest:id});
						$('#block').empty();
						$('#block').off('click');
						$('#block').attr('id', 'blocked');
						block(true);
						listenBlock(id);
						if ($('#chat2').length)
							$('#chat2').remove();
					}
					else
						errorHandle(res.message);
				});
		})
	}
	else if ($('#unblock').length != 0)
	{
		$('#unblock').on('click', function(){
			$.ajax({
				type        : 'DELETE',
				url         : '/block',
				data        : {'dest_id':id},
				dataType    : 'json',
				encode      : true
			})
				.done(function(res) {
					if (res.status == 'success')
					{
						$('#unblock').empty();
						$('#unblock').off('click');
						$('#unblock').attr('id', 'blocked');
						block(false);
						listenBlock(id);
					}
					else
						errorHandle(res.message);
				});
		})
	}
};

var listenProfile = function(){

	var id = window.location.hash.split('/').pop();
	var id = parseInt(id);

	listenLike(id);
	listenBlock(id);
	if ($('#report').length != 0)
	{
		$('#report').on('click', function(){
			$.ajax({
				type        : 'POST',
				url         : '/report',
				data        : {'dest_id':id},
				dataType    : 'json',
				encode      : true
			})
				.done(function(res) {
					if (res.status == 'success')
						alert('User has been reported to an admin');
					else
						alert('The report didn\'t work');
				});
		})
	}
}
