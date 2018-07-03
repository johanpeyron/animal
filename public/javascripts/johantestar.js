// ====================   Globals   ===========================================
// Global array with data from MongoDB
let gAdata = [];

// DOM Ready ==================================================================
$(document).ready(function() {
  
  // Populate the user table on initial page load
  populateTable();
});

// ====================   Helper functions    =================================

$("#btnToggleFormEtt").click(function () {
  $(formEtt).toggle();
});

$("#btnToggleFormAddAnimal").click(function () {
  //$('#areaDbug').append('test');
  $('#areaDbug').text('');
  $(formAddAnimal).toggle();
});

$("#btnResetDB").click(function () {
  resetDB();
});

// ====================   Functions   =========================================


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
          //$('#index').val(gAdata[0].id);
          $('#id').val(gAdata[0].id);
          $('#answer').val(gAdata[0].answer);
          // Infotext from the db
            $('#formEttFraga').text(gAdata[0].question);
        }
    });
}

// Reset db to initial state
function resetDB() {
    $.ajax({
        type: 'DELETE',
        url: '/animalsroute/deleteanimal'
    }).done(function (response) {

        // Check for a successful (blank) response
        if (response.msg === '') {} else {
          alert('Error: ' + response.msg);
        }

        // Go get the fresh data
        populateTable();
    });
}

function playGame(button) {
    l_obj = {};
    l_id = 0;
    txt = "";
    answerMatches = "";

    // Display infotext and the first question
    // Documents in MongoDB with id < 8 carry infotext and questions
    // The document with id = 8 has the first question
    if (Number($('#id').val()) < 2) {
        l_id = Number($('#id').val()) + 1;
        $('#id').val(l_id);

        if (button == 'No') {
          // Player is not in a playful mood today, reload page
          location.reload(true);
          return;
        }

        if ($('#id').val() == "2") {
          // Display first question
          l_id = 8;
          $('#id').val(l_id);
        }
        
        l_obj = loopIds(l_id);
        askQuestion(l_obj);
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
    answerMatches = $('#answerMatchesQuestion').val();

    // Remember previous question
    copyPrevious();

    if ('Yes' == answerMatches) {
        // Move one question-node down the binary tree
        l_id = 2 *l_id;
        l_obj = loopIds(l_id);
        if (l_obj.id != "") {
            askQuestion(l_obj);
        } else {
            l_obj = loopIds(l_id + 1);
            if (l_obj.id != "") {
                askQuestion(l_obj);
            } else {
                teachMeMoreAnimals();
            }
        }
    } else {
          // Stay on the node and examine the other leaf  
          l_id = ('Yes' == $('#answer').val()) ? l_id + 1 : l_id - 1; 
          l_obj = loopIds(l_id);
          if (l_obj.id != "") {
              askQuestion(l_obj);
          } else {
              teachMeMoreAnimals();
          }
        }
}

function formAddAnimalResponse(button) {
    let l_obj = {};
    let l_id = 0;
    let txt = "";
    let isCorrect = false;
    
    // Correct guess!
    if (button == "Yes") {
        isCorrect = true;
        l_id = 5;
    } else {
        isCorrect = false;
        l_id = 6;
    }
    
    l_obj = loopIds(l_id);
    txt = l_obj.question;
    if (6 == l_id) {
       txt += " "+ $('#animal').val() ;
    }
    
    $('#formAddAnimalFraga').text(txt);
}

// Add Animal
function addAnAnimal() {
    let l_obj = {};
    let newAnimal = {};
    let animalDate = "2018-01-22T14:56:59.301Z";
    
    var newId = 0;
    var oldId = Number($('#id').val());
    var animal = $('#formAddAnimalAnimal').val();
    var question = $('#formAddAnimalQuestion').val();
    var correctAnsNewQuest = $("input[name='formAddAnimalCorrectAnswer']:checked").val();
    var prevAnswMatchPrevQuest = $('#prevanswerMatchesQuestion').val();
    var prevAnswer = $('#prevanswer').val();

    if ((animal === '') || (question === '')) {
        alert('Something is missing');
        return;
    }

    if ('Yes' == prevAnswMatchPrevQuest) {
        // Add a node
        newId = ('Yes' == correctAnsNewQuest) ? 2 * oldId : (2 * oldId) + 1;
    } else {
        // Add a leaf
        id ('No' == correctAnsNewQuest) {
            // Is there a 'Yes'-leaf? Update it to 'No'
            l_obj = loopIds(oldId + 1);
            if (l_obj.animal !== '') {
                updateId(l_obj.animal);
            }
        }
        
        newId = ('Yes' == correctAnsNewQuest) ? oldId + 1 : oldId - 1;
    }

    // Is this id already taken in the db?
    l_obj = loopIds(newId);
    if (l_obj.animal !== '') {
        // This id is taken, error out
        alert('Something went wrong when adding this animal');
        return;
    }

    // Add the animal into one object
    newAnimal.id = newId;
    newAnimal.animal = animal;
    newAnimal.question = question;
    newAnimal.answer = correctAnsNewQuest;
    newAnimal.keep = "0";

    // Use AJAX to post to the db
    $.ajax({
        type: 'POST',
        data: newAnimal,
        url: '/animalsroute/addanimal',
        dataType: 'JSON'
    }).done(function (response) {
        // Check for successful (blank) response
        if (response.msg === '') {
            location.reload(true);
            return;
        } else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
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
  //$(formEtt).hide();

  id = $('#answerMatchesQuestion').val() ? 6 : 4;
  l_obj = loopIds(id);
  //question = l_obj.question;
  txt = l_obj.question + " " + $('#animal').val() + ' ?';
  $('#formAddAnimalFraga').text(txt);
  //$('#addQuestionId').val(l_obj.id);
}


// Prevent form submission
$( "formAddAnimal" ).submit(function( event ) {
  event.preventDefault();
});

// get MongoDB-document based on gAdata[].id
function loopIds (val) {
    let l_obj = {};
    
    for (let i = 0; i < gAdata.length; i++) {
        if (gAdata[i].id == val) {
            l_obj.id = gAdata[i].id;
            //l_obj.index = i;
            l_obj.animal = gAdata[i].animal;
            l_obj.answer = gAdata[i].answer;
            l_obj.question = gAdata[i].question;

            return l_obj;
        }
    }
    // No match found, return empty object
    l_obj.id = 0;
    //l_obj.index = "";
    l_obj.animal = "";
    l_obj.answer = "";
    l_obj.question = "";
    
    return l_obj;
}

function askQuestion (obj) {
    //$('#index').val(obj.index);
    $('#id').val(obj.id);
    $('#animal').val(obj.animal);
    $('#answer').val(obj.answer);
    $('#question').val(obj.question);
    $('#formEttFraga').text(obj.question);
}

function copyPrevious () {
    //$('#previndex').val($('#index').val());
    $('#previd').val($('#id').val());
    $('#prevquestion').val($('#question').val());
    $('#prevanimal').val($('#animal').val());
    $('#prevanswer').val($('#answer').val());
    $('#prevanswerMatchesQuestion').val($('#answerMatchesQuestion').val());
}

function updateId (obj) {
    
}