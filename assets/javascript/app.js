var index = 0;

var config = {
    apiKey: "AIzaSyCBEgf2SHK_XVjTysib_qcuD8bSdIliwnA",
    authDomain: "train-schedule-720df.firebaseapp.com",
    databaseURL: "https://train-schedule-720df.firebaseio.com",
    projectId: "train-schedule-720df",
    storageBucket: "train-schedule-720df.appspot.com",
    messagingSenderId: "429236232035"
};
firebase.initializeApp(config);

var database = firebase.database();

function submitRow() {
    var newName = $(".newName").val().trim();
    var newDestination = $(".newDestination").val().trim();
    var newFrequency = $(".newFrequency").val().trim();

    database.ref().child($(this).attr("data-key")).child("name").set(newName);
    database.ref().child($(this).attr("data-key")).child("destination").set(newDestination);
    database.ref().child($(this).attr("data-key")).child("frequency").set(newFrequency);

    $(this).toggleClass("submitButton");
};

$(document).on("click", ".submitButton", removeRow);

$("#form").on("submit", function (event) {
    event.preventDefault();

    var name = $("#trainName").val().trim();
    var destination = $("#trainDestination").val().trim;
    var firstTime = $("#firstTrain").val().trim();
    var frequency = $("#trainFrequency").val().trim();

    database.ref().push({
        name: name,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency
    });

    $("#trainName").val("");
    $("#trainDestination").val("");
    $("#firstTrain").val("");
    $("#trainFrequency").val("");

    return false;
});

database.ref().orderByChild("dateAdded").on("child_added", function(childSnapshot) {

    var firstTime = childSnapshot.val().firstTime;
    var tFrequency = parseInt(childSnapshot.val().frequency);
    var firstTrain = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTrain);
    console.log(firstTime);
    var currentTime = moment();
    var currentTimeCalc = moment().subtract(1, "years");
    var diffTime = moment.diff(moment(firstTrain), "minutes");
    var tRemainder = diffTime%tFrequency;
    var minutesRemaining = tFrequency - tRemainder;
    var nextTrain = moment().add(minutesRemaining, "minutes").format ("hh:mm A");
    var beforeCalc = moment(firstTrain).diff(currentTimeCalc, "minutes");
    var beforeMinutes = Math.cell(moment.duration(beforeCalc).asMinutes());

    if ((currentTimeCalc - firstTrain) < 0) {
        nextTrain = childSnapshot.val().firstTime;
        console.log("Before First Train");
        minutesRemaining = beforeMinutes;
    }
    else {
        nextTrain = moment().add(minutesRemaining, "minutes").format("hh:mm A");
        minutesRemaining = tFrequency - tRemainder;
        console.log("Working");
    }

    var newRow = $("<tr>");
    newRow.addClass("row-" + index);
    var a = $("<td>").text(childSnapshot.val().name);
    var b = $("<td>").text(childSnapsnot.val().destination);
    var c = $("<td>").text(childSnapshot.val().frequency);
    var d = $("<td>").text(nextTrain);
    var e = $("<td>").text(minutesRemaining);

    newRow
        .append(a)
        .append(b)
        .append(c)
        .append(d)
        .append(e);

    $("#tableContent").append(newRow);

    indext++;

}, function (error) {
    alert(error.code);

});