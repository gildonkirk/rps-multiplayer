var database = firebase.database();
var player1 = false;
var turnCount = 1;
var oneWins = 0;
var oneLosses = 0;
var twoWins = 0;
var twoLosses = 0;


$('#enter').on("click", function() {
	event.preventDefault();
	var name = $('#name-input').val();
	if (player1 === false){
		database.ref('players/one').set({
			username: name,
			userWins: oneWins,
			userLosses: oneLosses,
			choice: ''
		});
		$('header').after('<p class="p1">You are player 1</p>')
		$('#player1').append('<div class="rps rps1">Rock</div>');
		$('#player1').append('<div class="rps rps1">Paper</div>');
		$('#player1').append('<div class="rps rps1">Scissors</div>');
		$('form').remove();
	} else {
		database.ref('players/two').set({
			username: name,
			userWins: twoWins,
			userLosses: twoLosses,
			choice:''
		});
		database.ref('turn').set({
			turn: turnCount
		});	
		$('header').after('<p class="p2">You are player 2</p>')		
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
		// the second person to log off is not being cleared from firebase due to the boolean below being set incorrectly
		player1 = !player1;
	} else {
		var username = snapshot.val().username;
		$('#name2').text(username);
	};
});

var p1Choice = '';
var p2Choice = '';

database.ref('players/one/choice').on('value', function(snapshot) {
	var p1Choice = snapshot.val();
});

database.ref('players/two/choice').on('value', function(snapshot) {
	var p2Choice = snapshot.val();
});


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
	var gameOutcome = $('#gameOutcome');
	if(gameOutcome = 'Player One Wins!') {
		oneWins++;
		twoLosses++;
	}
	turnCount++;
	console.log(turnCount);
	database.ref('turn').set({
		turn: turnCount
	});
	database.ref('players/one').update({
		userWins: oneWins,
		userLosses: oneLosses
	});
	database.ref('players/two').update({
		userWins: twoWins,
		userLosses: twoLosses
	});

};

// because this value gets updated twice (once for player one's choice and once for player two's)
// the counter is going up by two everytime
// how do i access parent elements with an object path?
database.ref('players').on('value', function(snapshot){
	var data = snapshot.val();
	if((data.one.choice === 'Rock') && (data.two.choice === 'Scissors')){
		// oneWins++;
		// twoLosses++;
		$('#gameOutcome').append('<p class="winner">Player One Wins!</p>');
	} else if((data.one.choice === 'Paper') && (data.two.choice === 'Rock')){
		// oneWins++;
		// twoLosses++;
	} else if((data.one.choice === 'Scissors') && (data.two.choice === 'Paper')){
		// oneWins++;
		// twoLosses++;
	} else if((data.two.choice === 'Rock') && (data.one.choice === 'Scissors')){
		// twoWins++;
		// oneLosses++;
	} else if((data.two.choice === 'Paper') && (data.one.choice === 'Rock')){
		// twoWins++;
		// oneLosses++;
	} else if((data.two.choice === 'Scissors') && (data.one.choice === 'Paper')){
		// twoWins++;
		// oneLosses++;
	};
});


// function getParent(snapshot) {
//   // You can get the reference (A Firebase object) from a snapshot
//   // using .ref().
//   var ref = snapshot.ref();
//   // Now simply find the parent and return the name.
//   return ref.parent().name();
// }

// p1 Wins
// database.ref('players/two/choice').on('value', function(snapshot) {

// });

// Need to make it so reload only deletes that users name, wins, etc. right now it gets rid of both users
$(window).on('unload', function(){
	var player = player1 ? 'one' : 'two';
	// how to reference specific user's info?
	database.ref().remove();
	player1 = false;
	turnCount = 1;
	oneWins = 0;
	oneLosses = 0;
	twoWins = 0;
	twoLosses = 0;
	// `players/${player}`
});
