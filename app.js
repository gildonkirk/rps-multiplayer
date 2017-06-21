
var database = firebase.database();
var player1 = false;
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
	} else {
		database.ref('players/two').set({
			username: name,
			userWins: wins,
			userLosses: losses
		});
	}
});
	
database.ref().on('value', function(snapshot) {
	
	if (player1 === false) {
		var username = snapshot.val().players.one.username;
		$('#player1').text(username);
	} else {
		var username = snapshot.val().players.two.username;
		$('#player2').text(username);
	};
	player1 = !player1;
});

// Need to make it so reload only deletes that users name, etc. right now it gets rid of everything
$(window).on('unload', function(){
	database.ref().remove();
	player1 = false;
});