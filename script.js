
// Initialize Firebase
var config = {
apiKey: "AIzaSyDRw8vbIMaDCRiVhDpJH1GSKzNtVI_8VgY",
authDomain: "jetsetpayroll.firebaseapp.com",
databaseURL: "https://jetsetpayroll.firebaseio.com",
projectId: "jetsetpayroll",
storageBucket: "jetsetpayroll.appspot.com",
messagingSenderId: "236066274546"
};
firebase.initializeApp(config);

var database = firebase.database();

// On Submit >> Write to Dom / Push to Firebase
$("#submitBtn").on("click", function(event) {
    event.preventDefault();
    console.log("SUBMIT BUTTON CLICKED");
    // capturing user input
    var newName = $("#name").val().trim();
    var newDest = $("#destination").val().trim();
    var newTime = $("#time").val().trim();
    var newFreq = $("#frequency").val().trim();
    
    // local object for QA and staging to firebase
    var newTR = {
        name: newName,
        dest: newDest,
        time: newTime,
        freq: newFreq
    };

    // push to firebase
    database.ref().push(newTR);

    console.log("New User Input:");
    console.log("Train Name: " + newTR.name);
    console.log("Destination: " + newTR.dest);
    console.log("Time: " + newTR.time);
    console.log("Frequency: " + newTR.freq);

    // >>>>>>>>>>>> TO DO: REPLACE W/ MODAL ALERT <<<<<<
    alert("New Train Information Submitted");

    $("#name").val("");
    $("#destination").val("");
    $("#time").val("");
    $("#frequency").val("");
});

database.ref().on("child_added", function(childSnapshot) {
    console.log("'childSnapshot' is: " + childSnapshot.val());

    var newName = childSnapshot.val().name;
    var newDest = childSnapshot.val().dest;
    var newFreq = childSnapshot.val().freq;

    // Calculations using moment.js methods.... aaargh
    // change year so first train arrives before now
    var newTime = moment(childSnapshot.val().time, "hh:mm A").subtract(1,"years");
    // diff between current and first train arriving
    var diffTime = moment().diff(moment(newTime), "minutes");
    var remainder = diffTime % childSnapshot.val().freq;
    // mins til next train
    var minAway = childSnapshot.val().freq - remainder;
    // next train time
    var nextTrain = moment().add(minAway, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm A");

    console.log("Info retrieved from DB childSnapshot: ");
    console.log("Name: " + newName);
    console.log("Dest: " + newDest);
    console.log("Time: " + newTime);
    console.log("Freq: " + newFreq);
    console.log("Next Train: " + nextTrain);

    var newTR = $("<tr>").append(
            $("<td>").text(newName),
            $("<td>").text(newDest),
            $("<td>").text(newFreq).addClass('text-center'),
            $("<td>").text(nextTrain).addClass('text-center'),
            $("<td>").text(minAway).addClass('text-center')
    );
    
    $("#displayTable > tbody").append(newTR);
});
