var database = firebase.database();
var player1 = false;
var turnCount = 1;
console.log(turnCount);
var wins = 0;
var losses = 0;

$('#enter').on("click", function() {
	console.log(turnCount);
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

		// telling what player you are not working
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
		database.ref('turn').set({
			turn: turnCount
		});	
		console.log(turnCount);
		// telling what player tou are not working
		$('#gameInstruct').text('You are player 2')		
		$('#player2').append('<div class="rps rps2">Rock</div>');
		$('#player2').append('<div class="rps rps2">Paper</div>');
		$('#player2').append('<div class="rps rps2">Scissors</div>');
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
	console.log(snapshot.val());
	// not currently working to switch from one persons turn to the other
	if ((snapshot.val()) % 2 != 0) {
		$(document).on('click', '.rps1', rps1choice)
		console.log('player1test');
	} else {
		$(document).on('click', '.rps2', rps2choice)
		console.log('player2test');
	}
});



// not able to make 1st player choice right now
function rps1choice() {
	console.log('player1');
	var rpsChoice = $(this).text();
	$(this).removeClass('rps');
	$(this).addClass('rpsChoice');
	$('.rps').remove();
	database.ref('players/one').update({
		choice: rpsChoice,
	});
	turnCount++;
	console.log(turnCount);
};

function rps2choice() {
	console.log('player2');
	var rpsChoice = $(this).text();
	$(this).removeClass('rps');
	$(this).addClass('rpsChoice');
	$('.rps').remove();
	database.ref('players/two').update({
		choice: rpsChoice
	});
	turnCount++;
	console.log(turnCount);
};

// Need to make it so reload only deletes that users name, wins, etc. right now it gets rid of both users
$(window).on('unload', function(){
	// how to reference specific user's info?
	database.ref().remove();
	player1 = false;
	player1turn = true;
});
