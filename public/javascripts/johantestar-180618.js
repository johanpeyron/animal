// Global variable with data from MongoDB
var animalsData = [];
// Keep track of current question.
var currId = -1;
// Current correct answer
var currCorrect = 0;

// ====================   Functions   ========================================

function shareAnimals(data) {
 animalsData = data;
}

function playGame(button) {
  var idYes = 0;
  var idNo = 0;

  
  // Player pressed 'Yes'. Next question: 2 * currId
  if (button == 'Yes') {
    idYes = 2 * currId;
    // Use idNo if idYes leads to nowhere
    idNo = (2 * currId) + 1;
  } else {
    idYes = (2 * currId) + 1;
    idNo = (2 * currId);
  }
  
  if (doIKnowMore(idYes)) {
    askNext(idYes);
  } else  if (doIKnowMore(idNo)) {
    askNext(idNo);
  } else {
    teachMeMoreAnimals();
  }
}

function askQuestion(id) {
  if (id < (animalsData.length - 1)) {
    if (doIKnowMore(id)) {
      $('#formEttFraga').text(animalsData[id].question);
      return true;
    }
    // No more questions found
    return false;
  }
}

function doIKnowMore(id) {
  return (animalsData[id] !== undefined);
}

function teachMeMoreAnimals(){
  alert('teachMeMoreAnimals');
}



// Small helper functions=========================================================
$("#btnFormEttYes").click(function () {
  var txt1 = 'Do you want to play a game?';
  var txt2 = 'Think of an animal and let me guess. Press Yes to start.';
  var foundQuestion = false;

  dbg('start:  Yes'+' currId= '+ currId +' currCorrect= '+ currCorrect+'\t');
  
  if (currId == -1){
    // Replace the info text
    $('#formEttFraga').text(txt2);
    currId = 0;
  } else {
    foundQuestion = askQuestion(currId);
    if (foundQuestion && currId == 0 && currCorrect == 0) {
      // The first question shows up. Our player has not reponded to it.
      
    }
    currId++;
  }
  
  dbg('end:  Yes'+' currId= '+ currId +' currCorrect= '+ currCorrect+'\n');
});

$("#btnFormEttNo").click(function () {
  var txt1 = 'Do you want to play a game?';
  
  dbg('start:  No'+' currId= '+ currId +' currCorrect= '+ currCorrect+'\n');
  // Game hasn´t started yet
  if (currId < 1) {
    $('#formEttFraga').text(txt1);
  } else {
    playGame('No');
  }
  
  dbg('end:  No'+' currId= '+ currId +' currCorrect= '+ currCorrect+'\n');
});

$("#radTva").click(function () {
  $(formAddAnimal).val(countQuestions());
});

function dbg(t){
  if(typeof t == "string") {
    $('#areaDbug').append(t);
  } else {
    $('#areaDbug').append('This was not text');
  }
}

$("#btnToggleFormDbug").click(function () {
  $(formDbug).toggle();
});

$("#btnToggleFormAddAnimal").click(function () {
  //$('#areaDbug').append('test');
  $('#areaDbug').text('');
  $(formAddAnimal).toggle();
});

$("#btnClear").click(function () {
  $('#areaDbug').text('');
});

// closure, creating global counter
// invoke with countQuestions();
var countQuestions = (function () {
  var counter = 0;
  return function () {
    counter += 1;
    return counter;
  };
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
    return a - b;
  });
  $('#minId').val(arrId[0]);

  // display max value
  arrId.reverse();
  $('#maxId').val(arrId[0]);
}
