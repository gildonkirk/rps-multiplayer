
var database = firebase.database();
var player1 = false;
var player1Turn = true;

$('#enter').on("click", function() {
	event.preventDefault();
	var name = $('#name-input').val();
	var wins = 0;
	var losses = 0;
	var playerChoice = $('<p>').addClass('playerChoice');

	if (player1 === false){
		database.ref('players/one').set({
			username: name,
			userWins: wins,
			userLosses: losses
		});
		$('#player1').append('<div class="rps">Rock</div>');
		$('#player1').append('<div class="rps">Paper</div>');
		$('#player1').append('<div class="rps">Scissors</div>');
	} else {
		database.ref('players/two').set({
			username: name,
			userWins: wins,
			userLosses: losses
		});
		$('#player2').append('<div class="rps">Rock</div>');
		$('#player2').append('<div class="rps">Paper</div>');
		$('#player2').append('<div class="rps">Scissors</div>');
	}
});
	
database.ref().on('value', function(snapshot) {
	
	if (player1 === false) {
		var username = snapshot.val().players.one.username;
		$('#name1').text(username);
	} else {
		var username = snapshot.val().players.two.username;
		$('#name2').text(username);
	};
	player1 = !player1;
});

$(document).on('click', '.rps', function(){
	var choice = $(this).text();
	$(this).removeClass('rps');
	$('.rps').remove();
	// $('#gameOutcome').text(choice);
});

// Need to make it so reload only deletes that users name, etc. right now it gets rid of everything
$(window).on('unload', function(){
	database.ref().remove();
	player1 = false;
	player1Turn = true;
});

