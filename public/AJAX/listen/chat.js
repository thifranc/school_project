var listenChat = function(dest){

	$('#send').on('click', function(e){
		e.preventDefault();
		var text = $('#text').val();
		if (text === '')
			return ;
		socket.emit('cli_msg', {'text':text, 'dest':dest});
		$('#text').val('');
	});

};
