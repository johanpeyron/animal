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
  var idYes = 0;
  var idNo = 0;

  // Player pressed 'Yes'. Next question: 2 * gId
  if (button == 'Yes' && isMatch ==1) {
    $('#formEttFraga').text(gAdata[gId].question);
    idYes = 2 * gId;
    // Use idNo if idYes leads to nowhere
    idNo = (2 * gId) + 1;
  } else {
    idYes = (2 * gId) + 1;
    idNo = (2 * gId);
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
  alert('teachMeMoreAnimals');
}



// Small helper functions======================================================
$("#btnFormEttYes").click(function () {
    l_obj = {};
    id = 0;
    txt = "";

    // the documents in MongoDB with id < 4 carry infotext
    // the document with id = 4 has the first question
    if (Number($('#id').val()) < 4) {
        id = Number($('#id').val()) + 2;
        $('#id').val(id);

        l_obj = loopIds(id);
        showNextQuestion(l_obj);
        return;
    }

    alert('game starts');
    
    if (indx >= 2) {
        l_obj = loopIds(indx);
        showNextQuestion(l_obj);
        
        // Question and answer match
        if (l_obj.answer == 'Yes') {
            // Remember the id of this animal
            ('#lastcorrect').val(l_obj.id);
            // Look for next question in "Yes"-direction
            indx = 2 * l_obj.id;
            l_obj = loopIds(indx);
            if (l_obj.id != "") {
                l_obj = loopIds(indx);
                // Ask that question
                showNextQuestion(l_obj);
            } else {
                // Look for next question in "No"-direction
                indx = 2 * l_obj.id;
                l_obj = loopIds(indx);
                if (l_obj.id != "") {
                    l_obj = loopIds(indx);
                    showNextQuestion(l_obj);
                } else {
                    // Player must add a new animal to the db
                    teachMeMoreAnimals();
                }
            }
        } else {
            // Question and answer did not match
            indx = (2 * gIndex) + 1;
            if (gAdata[indx ] !== undefined) {
                gIndex = indx + 1;
                $('#formEttFraga').text(gAdata[gIndex].question);
            } else {
                // Player must add a new animal to the db
                teachMeMoreAnimals();
            }
        }
    }
});

$("#btnFormEttNo").click(function () {
    
});

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

// call with id
// return object gAdata[id]
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
  // No match for
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
  $('#formEttFraga').text(obj.question);
}