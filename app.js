
var database = firebase.database();

$('#enter').on("click", function() {
	event.preventDefault();
	var name = $('#name-input').val();
	var wins = 0;
	var losses = 0;

	database.ref().set({
		username: name,
		userWins: wins,
		userLosses: losses
	});
});
	
database.ref().on('value', function(snapshot) {
	$('#player1').text(snapshot.val().username);
});
