// ====================   Globals   ===========================================
// Global variable with animals array
let gAdata = [];
// current index in gAdata
let gIndex = 0;
// id of current question
let gId = 0;
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
  // local id, temp variable when testing gIndex
  let l_id = 0;
  testObj = {};

/*   detta funkar
     testObj = loopIds(2);
  if (testObj.id == undefined) {
      alert('nothing back');
  } else {
    alert(testObj.id);
  } */

 /*  if (gId > 1) {
    dbg('start:  Yes'+' id= '+ gAdata[gId].id +'\t');
  } */
  
  // gAdata[0] and gAdata[1] contain infotext
  // gAdata[2] is the first node in the game-tree
  if (gIndex < 3){
    $('#formEttFsraga').text(gAdata[gIndex].question);
    gIndex++;
    
    return;
  }
  
  isMatch = (gAdata[gIndex].answer == 'Yes') ? 1 : 0;
  
  // Question and answer match
  if (isMatch == 1) {
      // Is there a next question with id =  2 * gId ?
      l_id = 2 * gId;
      testObj = loopIds(l_id);
      if (testObj.id != "") {
          // Ask that question
          gId = l_id;
          $('#formEttFraga').text(gAdata[gId].question);
      } else {
          // Player must add a new animal to the db
            teachMeMoreAnimals();
      }
  } else {
        // Question and answer did not match
        l_id = (2 * gId) + 1;
        if (gAdata[l_id ] !== undefined) {
          gId = l_id + 1;
          $('#formEttFraga').text(gAdata[gId].question);
      } else {
          // Player must add a new animal to the db
            teachMeMoreAnimals();
      }
  }
  
  dbg('end:  Yes'+' id= '+ gAdata[gId].id +'\r\n');
});



$("#btnFormEttNo").click(function () {
    
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

function loopIds (val) {
  let myObj = {};
  
  for (let i = 0; i < gAdata.length; i++) {
    if (gAdata[i].id == val) {
        myObj.animal = gAdata[i].animal;
        myObj.answer = gAdata[i].answer;

        return myObj;
    }
  }

  return myObj;
}