// ====================   Globals   ===========================================
// Global variable with animals array
let gAdata = [];
// current index in gAdata
let gIndex = 0;
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

  var animId = $('#addAnimalId').val();
  var animName = $('#addAnimalName').val();
  var animQuest = $('#addAnimalQuestion').val();
  var animAnswer = $("input[name='yesorno']:checked").val();

  if ((animId === '') || (animName === '') || (animQuest === '')) {
    alert('Something is missing');
    return;
  }


  // Compile the animal info into one object
  var newAnimal = {
    'id': animId,
    'animal': animName,
    'question': animQuest,
    'answer': animAnswer
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

// Delete animal
function deleteAnAnimal() {

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
  id = 0;
  txt = "";

  // This section display infotext and the first question
  // Documents in MongoDB with id < 4 carry infotext
  // The document with id = 4 has the first question
  if (Number($('#id').val()) < 4) {
      id = Number($('#id').val()) + 2;
      $('#id').val(id);

      if (button == 'No') {
        // Player is not in a playful mood today, reload page
        location.reload();
        return;
      }

      l_obj = loopIds(id);
      showNextQuestion(l_obj);
      return;
  }

  // Respond to a question
  id = Number($('#id').val());
      
  // Question and answer match
  if ($('#answer').val() == button) {
      // Remember the id of this animal
      $('#lastcorrect').val(id);
  }
  
  // Look for next question in "Yes"-direction
  id = 2 * id;
  l_obj = loopIds(id);
  if (l_obj.id != "") {
      // Ask that question
      showNextQuestion(l_obj);
  } else {
      // Look for next question in "No"-direction
      id = id + 1;
      l_obj = loopIds(id);
      if (l_obj.id != "") {
          showNextQuestion(l_obj);
      } else {
          // Player must add a new animal to the db
          teachMeMoreAnimals();
      }
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
  l_obj = {};
  addMe = {};
  id = 0;
  lastcorrect = 0;
  txt = "";
  question = "";
  animal = "";
  
  // The last animal we know for sure is correct
  // We assume our player is thinking of it
  id = Number($('#lastcorrect').val());
  l_obj = loopIds(id);
  animal = l_obj.animal;
  
  // gAdata[].id = 1 contains the first add-animal question
  l_obj = loopIds(1);
  question = l_obj.question;
  txt = question + " " + animal + ' ?';
  $('#skillnad').text(txt);
}



// Small helper functions======================================================

$("#radTva").click(function () {
  $(formAddAnimal).val(countQuestions());
});

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

function showNextQuestion (obj) {
  $('#index').val(obj.index);
  $('#id').val(obj.id);
  $('#answer').val(obj.answer);
  $('#question').val(obj.question);
  $('#formEttFraga').text(obj.question);
}
