var database = firebase.database();
var player1 = false;
var turnCount = 1;
var wins = 0;
var losses = 0;

$('#enter').on("click", function() {
	console.log(turnCount);
	event.preventDefault();
	var name = $('#name-input').val();
	var playerChoice = $('<p>').addClass('playerChoice');
	if (player1 === false){
		database.ref('players/one').set({
			username: name,
			userWins: wins,
			userLosses: losses
		});

		$('header').after('<p>You are player 1</p>')
		$('#player1').append('<div class="rps rps1">Rock</div>');
		$('#player1').append('<div class="rps rps1">Paper</div>');
		$('#player1').append('<div class="rps rps1">Scissors</div>');
		$('form').remove();
	} else {
		database.ref('players/two').set({
			username: name,
			userWins: wins,
			userLosses: losses
		});
		database.ref('turn').set({
			turn: turnCount
		});	
		$('header').after('<p>You are player 2</p>')		
		$('#player2').append('<div class="rps rps2">Rock</div>');
		$('#player2').append('<div class="rps rps2">Paper</div>');
		$('#player2').append('<div class="rps rps2">Scissors</div>');
		$('form').remove();
	}	
});



//when firebase is updated, displays usernames on each users screen
database.ref('players').on('child_added', function(snapshot) {	
	if (player1 === false) {
		var username = snapshot.val().username;
		$('#name1').text(username);
		player1 = !player1;
	} else {
		var username = snapshot.val().username;
		$('#name2').text(username);
	};
});

// sends choice to firebase and displays it only to local user, should toggle between turns
database.ref('turn/turn').on('value', function(snapshot) {
	if ((snapshot.val()) % 2 != 0) {
		$('.turn').text('Your Turn Player 1');
		$('#player1').css('border', '2px solid yellow');
		$('#player2').css('border', '2px solid #222222');
		$(document).on('click', '.rps1', rps1choice)
		.off('click', '.rps2', rps2choice);
	} else {
		$('.turn').text('Your Turn Player 2');
		$('#player2').css('border', '2px solid yellow');
		$('#player1').css('border', '2px solid #222222');
		$(document).on('click', '.rps2', rps2choice)
		.off('click', '.rps1', rps1choice);
	}
});

function rps1choice() {
	var rpsChoice = $(this).text();
	$(this).removeClass('rps');
	$(this).addClass('rpsChoice');
	$('.rps').remove();
	database.ref('players/one').update({
		choice: rpsChoice,
	});
	turnCount++;
	database.ref('turn').set({
		turn: turnCount
	});	
};

function rps2choice() {
	var rpsChoice = $(this).text();
	$(this).removeClass('rps');
	$(this).addClass('rpsChoice');
	$('.rps').remove();
	database.ref('players/two').update({
		choice: rpsChoice
	});
	turnCount++;
	database.ref('turn').set({
		turn: turnCount
	});
};

var player1Choice = database.ref('players/one/choice');
var player2Choice = database.ref('players/two/choice');
console.log(player1Choice);
console.log(player2Choice);


// player2Choice.on('value', function(snapshot) {
// 	if(player1Choice)
// });

// Need to make it so reload only deletes that users name, wins, etc. right now it gets rid of both users
$(window).on('unload', function(){
	// how to reference specific user's info?
	database.ref().remove();
	player1 = false;
	player1turn = true;
});
