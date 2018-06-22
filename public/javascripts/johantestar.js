// ====================   Globals   ===========================================
// Global variable with animals array
let gAdata = [];
// Global for current value of animals[].id
let gId = -1;
// did player answer current question?
let gIsAnswered = 0;

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
          // Assign first questions id to gId
          gId = gAdata[0].id;
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

  dbg('start:  playGame'+' gId= '+ gId +' isMatch= '+ isMatch+'\n');
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
  dbg('end:  playGame'+' gId= '+ gId +' isMatch= '+ isMatch+'\r\t');
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
//Does answer match question?
  let isMatch = 0;
  // function_Id, local for this function
  let f_Id = 0;

  dbg('start:  Yes'+' id= '+ gAdata[gId].id +'\t');
  
  // Everything in the db with id < 1 is infotext
  if (gId < 1){
    // Get new info text
    gId++;
    $('#formEttFraga').text(gAdata[gId].question);
    //dbg('end:  Yes'+' id= '+ gAdata[gId].id +' isMatch= '+ isMatch+'\r\n');
    
    return;
  }
  
  isMatch = (gAdata[gId].answer == 'Yes') ? 1 : 0;
  
  // Question and answer match
  if (isMatch == 1) {
      // Is there a next question with id =  2 * gId ?
      f_Id = 2 * gId;
      if (gAdata[f_Id] !== undefined) {
        // Ask that question
        gId = f_Id;
        $('#formEttFraga').text(gAdata[gId].question);
      }
      // Question and answer did not match
      else if (gAdata[f_Id + 1] !== undefined) {
        gId = f_Id + 1;
        $('#formEttFraga').text(gAdata[gId].question);
      } else {
        // Player must add a new animal to the db
          teachMeMoreAnimals();
      }
  }
  dbg('end:  Yes'+' id= '+ gAdata[gId].id +'\r\n');
});



$("#btnFormEttNo").click(function () {

  dbg('start:  No'+' gId= '+ gId +' isMatch= '+ isMatch+'\n');
  if (gId > 1) {
    playGame('No');
  }
  
  dbg('end:  No'+' gId= '+ gId +' isMatch= '+ isMatch+'\r\n');
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
