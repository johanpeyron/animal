// ====================   Globals   ===========================================
// Global variable with animals array
let gAdata = [];
// id of current question
let gId = 0;
// answer to current question
let gAnswer = "";

// DOM Ready =============================================================
$(document).ready(function() {
  
  // Populate the user table on initial page load
  populateTable();
  
  
});

// Functions =============================================================


// Fill table with data
function populateTable() {
    // jQuery AJAX call to get the animals
    $.getJSON( '/animalsroute/animals', function( animaldata ) {
        var databasTxt = '';

        // nodetest2.animalDB.animals
        databasTxt = JSON.stringify(animaldata);
        
        $('#dbTxt').text(databasTxt);
        $('#radEtt').val(databasTxt);
        gAdata = animaldata;
        
        if (gAdata[0] !== undefined) {
          //gId = gAdata[0].id;
          $('#index').val(gAdata[0].id);
          $('#id').val(gAdata[0].id);
          $('#answer').val(gAdata[0].answer);
          // Infotext from the db
            $('#formEttFraga').text(gAdata[0].question);
        }
    });
}

// Add Animal
function addAnAnimal() {
  let l_obj = {};

  //var newId = $('#newId').val();
  var newId = '';
  var lastId = $('#lastId').val();
  var animalName = $('#addAnimalName').val();
  var animalQuestion = $('#addAnimalQuestion').val();
  var correctAnswer = $("input[name='yesorno']:checked").val();

  if ((animalName === '') || (animalQuestion === '')) {
    alert('Something is missing');
    return;
  }

  // Find the id for our new animal
  // User has selected 'Yes' as the correct answer to the question
  if ('Yes' == (correctAnswer)) {
      newId = 2 * lastId;
  } else {
    newId = (2 * lastId) + 1;
  }

  // Is this id already taken in the db?
  l_obj = loopIds(newId);
  if (l_obj.id !== '') {
    // This id is takern, error out
    alert('Something went wrong when adding this animal');
    return;
  }

  // Compile the animal info into one object
  var newAnimal = {
    'id': newId,
    'animal': animalName,
    'question': animalQuestion,
    'answer': correctAnswer
  };

  // Use AJAX to post the object to my addanimal service
  $.ajax({
    type: 'POST',
    data: newAnimal,
    url: '/animalsroute/addanimal',
    dataType: 'JSON'
  }).done(function (response) {

    // Check for successful (blank) response
    if (response.msg === '') {
      // Update the table
      populateTable();
    } else {
      // If something goes wrong, alert the error message that our service returned
      alert('Error: ' + response.msg);
    }
  });
}

// Reset db by deleting documents with id > 8
function resetDB() {

  // Pop up a confirmation dialog
  var confirmation = confirm('Delete this animal?');

  // Check and make sure the user confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/animalsroute/deleteanimal/' + $('#deleteAnimalId').val()
    }).done(function (response) {

      // Check for a successful (blank) response
       if (response.msg === '') {} else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      populateTable();

    });
  } else {

    // If they said no to the confirm, do nothing
    return false;

  }
}






// ====================   Assignments   =========================================

// ====================   Functions   =========================================

function playGame(button) {
  l_obj = {};
  l_id = 0;
  txt = "";

  // Display infotext and the first question
  // Documents in MongoDB with id < 8 carry infotext and questions
  // The document with id = 8 has the first question
  if (Number($('#id').val()) < 2) {
      l_id = Number($('#id').val()) + 1;
      $('#id').val(l_id);

      if (button == 'No') {
        // Player is not in a playful mood today, reload page
        location.reload();
        return;
      }

      if ($('#id').val() == "2") {
        // Display first question
        l_id = 8;
        $('#id').val(l_id);
      }
      
      l_obj = loopIds(l_id);
      askNextQuestion(l_obj);
      return;
    }
    
    // Respond to a question
    l_id = Number($('#id').val());
    
    // Do question and answer match?
    if ($('#answer').val() == button) {
        $('#answerMatchesQuestion').val('Yes');
    } else {
      $('#answerMatchesQuestion').val('No');
    }
  
  // If this was a 'Yes-question' to our animal, try to move in a 'No-direction'
  if ('Yes' == $('#answer').val()) {
    l_id = l_id + 1;
  }   else {
    l_id = l_id - 1;
  }
  
  // Look for the next animal.
  l_obj = loopIds(l_id);
  if (l_obj.id != "") {
      // Ask that question
      askNextQuestion(l_obj);
  } else {
      teachMeMoreAnimals();
  }
}

function askQuestion(id) {
  if (id < (gAdata.length - 1)) {
    if (doIKnowMore(id)) {
      $('#formEttFraga').text(gAdata[gId].question);
      return true;
    }
    // No more questions found
    return false;
  }
}

function doIKnowMore(id) {
  return (gAdata[gId] !== undefined);
}

function teachMeMoreAnimals(){
  let l_obj = {};
  let addMe = {};
  let id = 0;
  let lastcorrect = 0;
  let txt = "";
  //let question = "";
  let animal = "";
  
  // Hide formEtt
  $(formEtt).hide();

  // gAdata[].id = 4 contains the first add-animal question
  l_obj = loopIds(4);
  //question = l_obj.question;
  txt = l_obj.question + " " + $('#animal').val() + ' ?';
  $('#skillnad').text(txt);
  //$('#addQuestionId').val(l_obj.id);
}

function handleResponse(button) {
  l_obj = {};
  id = 0;
  txt = "";
  
  // Correct guess!
  if (button == "Yes") {
    $('#guessIsCorrect').val(true);
    
    l_obj = loopIds(5);
    txt = l_obj.question;
    $('#skillnad').text(txt);
  } else {
    $('#guessIsCorrect').val(false);
    l_obj = loopIds(6);
    txt = l_obj.question + " "+ $('#animal').val() ;
    $('#skillnad').text(txt);

    }
}

function getNewAnimalId (button) {
  let id = 0;

  id = $('#lastId').val();


  

}

// Small helper functions======================================================

$("#radTva").click(function () {
  $(formAddAnimal).val(countQuestions());
});

$("#btnToggleFormEtt").click(function () {
  $(formEtt).toggle();
});

$("#btnToggleFormAddAnimal").click(function () {
  //$('#areaDbug').append('test');
  $('#areaDbug').text('');
  $(formAddAnimal).toggle();
});

$("#btnClear").click(function () {
  resetDB();
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

// closure, keep track of current id
var curId = (function (val) {
  var l_val = 0;
  return function () {
    l_val = val;
    return l_val;
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

// call with id, return MongoDB-document
function loopIds (val) {
  let l_obj = {};
  
  for (let i = 0; i < gAdata.length; i++) {
    if (gAdata[i].id == val) {
        l_obj.id = gAdata[i].id;
        l_obj.index = i;
        l_obj.animal = gAdata[i].animal;
        l_obj.answer = gAdata[i].answer;
        l_obj.question = gAdata[i].question;

        return l_obj;
    }
  }
  // No match found, return empty object
  l_obj.id = "";
  l_obj.index = "";
  l_obj.animal = "";
  l_obj.answer = "";
  l_obj.question = "";
  
  return l_obj;
}

function askNextQuestion (obj) {
  $('#index').val(obj.index);
  $('#id').val(obj.id);
  $('#animal').val(obj.animal);
  $('#answer').val(obj.answer);
  $('#question').val(obj.question);
  $('#formEttFraga').text(obj.question);
}
