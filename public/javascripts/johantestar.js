// ====================   Globals   ===========================================
// Global variable with animals-array from global.js
let gAdata = gAnimalData;
// Global for current value of animals[].id
let gId = -1;
// did player answer current question?
let gIsAnswered = 0;


// ====================   Assignments   =========================================

  // Replace formEttFraga with data from db
  $('#formEttFraga').text(gAdata[0].question);
  // Assign first questions id to gId
  if (gAdata[0] !== undefined) {
    gId = gAdata[0].id;
  }
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

  if (gId > -1) {
    dbg('start:  Yes'+' id= '+ gAdata[gId].id +'\t');
  }
  
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
