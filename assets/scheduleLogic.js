// Initialize firebase
// Create button for adding new train that saves all form input to firebase
// When new one added, retrieve all train info from firebase
// Calculate next arrival time and minutes until next
// Add all above to the table


// Initialize firebase
var config = {
    apiKey: "AIzaSyBz0xaZ3-V84TxSX49RWmgN_ozQ-KB5Xus",
    authDomain: "train-scheduler-d37aa.firebaseapp.com",
    databaseURL: "https://train-scheduler-d37aa.firebaseio.com",
    projectId: "train-scheduler-d37aa",
    storageBucket: "train-scheduler-d37aa.appspot.com",
    messagingSenderId: "608347940362"
};

firebase.initializeApp(config);

var database = firebase.database();

// When submit button is clicked
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Save all input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var trainFirst = $("#first-time-input").val().trim();
    var trainFreq = $("#frequency-input").val().trim();

    // Create an object with input
    var newTrain = {
        name: trainName,
        destination: trainDest,
        firstTime: trainFirst,
        frequency: trainFreq

    };
    console.log(newTrain);

    // Push that object to firebase
    database.ref().push(newTrain);

    // Clear form
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-time-input").val("");
    $("#frequency-input").val("");

});

// When new train is added to firebase
database.ref().on("child_added", function(snapshot, prevChildKey) {
    
    // Save all the data
    var trainName = snapshot.val().name;
    var trainDest = snapshot.val().destination;
    var trainFirst = snapshot.val().firstTime;
    var trainFirstFormat = moment(trainFirst, "HH:mm");
    var trainFreq = snapshot.val().frequency;

    // Find number of minutes between first train time and current time
    var diff = moment().diff(moment(trainFirstFormat), "minutes");

    // Divide by train frequency, Remainder is time since last train
    var minutesSinceLast = diff % trainFreq;
    
    // Subtract time since last from frequency for minutes away
    var minutesAway = trainFreq - minutesSinceLast;

    // Add that to current time for next arrival
    var nextArrival = moment().add(minutesAway, "minutes");
    var nextArrivalFormat = moment(nextArrival).format("hh:mm a");

    // Add it to the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
    trainFreq + "</td><td>" + nextArrivalFormat + "</td><td>" + minutesAway + "</td></tr>");

});

// TO DO:
// add if difference is POSITIVE, then leave above,
// but if difference is NEGATIVE (first train scheduled for future)
// next train is trainFirstFormat
// and minutesAway is the difference made positive