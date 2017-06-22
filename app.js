
var database = firebase.database();
var player1 = false;
var player1turn = true;
var wins = 0;
var losses = 0;

$('#enter').on("click", function() {
	event.preventDefault();
	var name = $('#name-input').val();
	var playerChoice = $('<p>').addClass('playerChoice');
	$('form').remove();
	if (player1 === false){
		database.ref('players/one').set({
			username: name,
			userWins: wins,
			userLosses: losses
		});

		// telling what player tou are not working
		$('#gameInstruct').text('You are player 1')
		$('#player1').append('<div class="rps rps1">Rock</div>');
		$('#player1').append('<div class="rps rps1">Paper</div>');
		$('#player1').append('<div class="rps rps1">Scissors</div>');
	} else {
		database.ref('players/two').set({
			username: name,
			userWins: wins,
			userLosses: losses
		});
		database.ref().update({
			oneTurn: player1turn
		});	

		// telling what player tou are not working
		$('#gameInstruct').text('You are player 2')		
		$('#player2').append('<div class="rps rps2">Rock</div>');
		$('#player2').append('<div class="rps rps2">Paper</div>');
		$('#player2').append('<div class="rps rps2">Scissors</div>');
	}
});

//when firebase is updated, displays usernames on each users screen
database.ref().on('value', function(snapshot) {	
	if (player1 === false) {
		var username = snapshot.val().players.one.username;
		$('#name1').text(username);
		player1 = !player1;
	} else {
		var username = snapshot.val().players.two.username;
		$('#name2').text(username);
	};
});

// sends choice to firebase and displays it only to local user, should toggle between turns
database.ref('oneTurn').on('value', function(snapshot) {
	if (snapshot.val().oneTurn === true) {
		$(document).on('click', '.rps1', rps1choice)
	} else {
		$(document).on('click', '.rps2', rps2choice)
	}
});
 
// not able to make 1st player choice right now
function rps1choice() {
	var rpsChoice = $(this).text();
	$(this).removeClass('rps');
	$(this).addClass('rpsChoice');
	$('.rps').remove();
	database.ref('players/one').update({
		choice: rpsChoice,
	});
	database.ref().update({
		oneTurn: !player1turn,
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
	database.ref().update({
		oneTurn: !player1turn,
	});
};

// Need to make it so reload only deletes that users name, wins, etc. right now it gets rid of both users
$(window).on('unload', function(){
	// how to reference specific user's info?
	database.ref().remove();
	player1 = false;
	player1turn = true;
});

