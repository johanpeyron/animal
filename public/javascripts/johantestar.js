// Global variable with data from MongoDB
var animalsData = [];
// Keeping track of current question.
var currId = 0;

// ====================   Functions   ========================================

function passAnimals(data) {
 animalsData = data;
}

function playGame(button) {
  var myId = 0;

  $('#formEttFraga').text(animalsData[currId].question);
  if (currId < (animalsData.length - 1)) {
    currId++;
  }
  // Player pressed 'Yes'. Next question: 2 * currId
  if (button == 'Yes') {
    myId = 2 * currId;
  } else {
    myId = (2 * currId) + 1;
  }

  if (animalsData[myId] !== undefined) {
    alert('found next question');
  } else {
    alert('no more questions');
  }
}



// Small helper functions=========================================================
$("#btnFormEttYes").click(function () {
  var txt1 = 'Do you want to play a game?';
  var txt2 = 'Think of an animal and let me guess. Press Yes to start.';
  
  // Player clicks Yes for the first time
  if ($('#formEttFraga').text() == txt1) {
    $('#formEttFraga').text(txt2);
  } else {
    playGame('Yes');
  }
});

$("#btnFormEttNo").click(function () {
  var txt1 = 'Do you want to play a game?';
  // Game hasn´t started yet
  if (currId < 1) {
    $('#formEttFraga').text(txt1);
  } else {
    playGame('No');
  }
});

$("#radTva").click(function () {
  $(formAddAnimal).val(countQuestions());
});

$("#btnToggleFormDbug").click(function () {
  $(formDbug).toggle();
});

$("#btnToggleFormAddAnimal").click(function () {
  $(formAddAnimal).toggle();
});

// closure, creating global counter
// invoke with countQuestions();
var countQuestions = (function () {
  var counter = 0;
  return function () {
    counter += 1;
    return counter;
  }
})();

function clearUserInput() {
  $('#formAddAnimal').reset();
}
// Prevent form submission
$( "formAddAnimal" ).submit(function( event ) {
  event.preventDefault();
});

function dbugLog() {
  var arrAnimal = [];
  var arrId = [];
  var i = 0;
  var txt = "";

  arrAnimal = JSON.parse(document.getElementById('dbTxt').innerHTML);
  for (i = 0; i < arrAnimal.length; i++) {
    arrId.push(arrAnimal[i].id);
  }

  $('#allIds').val(arrId);

  // Sort arrId ascending and display min value
  arrId.sort(function (a, b) {
    return a - b
  });
  $('#minId').val(arrId[0]);

  // display max value
  arrId.reverse();
  $('#maxId').val(arrId[0]);
}
