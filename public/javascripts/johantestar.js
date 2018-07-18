// ====================   Globals   ===========================================
// Global array with data from MongoDB
let gAdata = [];

// DOM Ready ==================================================================

$(document).ready(function() {
  
  // Populate the user table on initial page load
  populateTable();
  //$("#formAddAnimal").hide();
});

// ====================   Helper functions    =================================

$("#btnToggleFormEtt").click(function () {
  $(formEtt).toggle();
});

$("#btnToggleFormAddAnimal").click(function () {
  //$(formAddAnimal).toggle();
  $("#formAddAnimal").show();
});

$("#btnToggleDbTxt").click(function () {
    $('#dbTxt').toggle();
    $(hideMe2).toggle();
});

$("#btnResetDB").click(function () {
    resetDB();
});

$("#btnUpdateId").click(function () {
    dBugPUT();
});

// Keep track of that button addAnimalYes is clicked
// http://api.jquery.com/jQuery.data/
$( "#addAnimalYes" ).click( function() {
    let btn = $( "#addAnimalYes" )[ 0 ];
      jQuery.data( btn, "clicked", true );
});
// ====================   Functions   =========================================


// Fill table with data
function populateTable() {
    $("#formAddAnimal").hide();
    // Prevent user from adding animals
    //$("#btnformAddAnimal").prop('disabled', true);
    // Reset formDbug + formAddAnimal
    //resetForms();
    // jQuery AJAX call to get the animals
    $.getJSON( '/animalsroute/animals', function( animaldata ) {
        var databasTxt = '';

        // nodetest2.animalDB.animals
        databasTxt = JSON.stringify(animaldata);
        
        $('#dbTxt').text(databasTxt);
        $('#radEtt').val(databasTxt);
        gAdata = animaldata;
        
        if (gAdata[0] !== undefined) {
            $('#id').val(gAdata[0].id);
            // Infotext from the db
            //$('#formEttFraga').text(gAdata[0].question);
            $('#formEttFraga').val(gAdata[0].question);
        }
    });
    document.getElementById("btnFormEttYes").focus();
}

/* function resetForms() {
    document.getElementById("formDbug").reset();
    document.getElementById("formAddAnimal").reset();
} */

// Reset db to initial state
function resetDB() {
    $.ajax({
        type: 'DELETE',
        url: '/animalsroute/resetdb'
    }).done(function (response) {

        // Check for a successful (blank) response
        if (response.msg === '') {} else {
          alert('Error: ' + response.msg);
        }

        // Go get fresh data
        populateTable();
    });
}

function playGame(button) {
    l_obj = {};
    l_id = 0;
    txt = "";
    //answerMatches = "";

    // Remember what putton the player pressed
    $('#playerSays').val(button);

    // Documents in MongoDB with id < 8 carry infotext and questions
    if (Number($('#id').val()) < 2) {
        l_id = Number($('#id').val()) + 1;
        $('#id').val(l_id);

        if (button == 'No') {
          location.reload(true);
          return;
        }

        if ($('#id').val() == "2") {
          l_id = 8;
          $('#id').val(l_id);
        }
        
        l_obj = loopIds(l_id);
        askQuestion(l_obj);
        return;
    }
    
    // Respond to a question
    l_id = Number($('#id').val());
    
    // Remember previous question
    //copyPrevious();

    // 0.3.23
    l_id = playerAnswers(l_id);

    // 0.3.24
    //l_id = idOnAnswer(l_id);

    l_obj = loopIds(l_id);
    if (l_obj.id != "") {
        askQuestion(l_obj);
    } else {
        teachMeMoreAnimals();
    }
}

// used in 0.3.23 to calculate id
function playerAnswers(nr) {
    let idNr = 0;
    idNr = ('Yes' == $('#playerSays').val()) ? 2 * nr : (2 * nr) + 1;
    return idNr;
}

// 0.3.24 calculate id based on answer
function idOnAnswer(nr) {
    let idNr = 0;
    idNr = ('Yes' == $('#answer').val()) ? 2 * nr : (2 * nr) + 1;
    return idNr;
}

function formAddAnimalResponse(button) {
    let l_obj = {};
    let l_id = 0;
    let txt = "";
    let btn = $( "#addAnimalYes" )[ 0 ];

    $("#formAddAnimal").show();

    // Has button addAnimalYes been clicked already?
    // Then restart game
    if (jQuery.data( btn, "clicked" )) {
        populateTable();
    }

    //$("#btnformAddAnimal").prop('enabled', true);
    //$('#formAddAnimalAnimal').removeAttr('readonly');
    //$('#formAddAnimalQuestion').removeAttr('readonly');

    l_id = (button == "Yes") ? 5 : 6;

    l_obj = loopIds(l_id);
    txt = l_obj.question;
    if (6 == l_id) {
       txt += " "+ $('#animal').val() ;
       document.getElementById("formAddAnimalAnimal").focus();
    }
    
    //$('#formAddAnimalFraga').text(txt);
    $('#formAddAnimalFraga').val(txt);
}

function animalValidation() {
    var animalObj = document.getElementById("formAddAnimalAnimal");
    var questionObj = document.getElementById("formAddAnimalQuestion");
    var animalMsg = "Please write an animal";
    var questionMsg = "Please write a question";
    var passedValidation = true;
    
    if (!animalObj.checkValidity()) {
        $('#animalError').val(animalMsg);
        // override bootstrap.css
        $("#animalError").show();
        passedValidation = false;
    }
    if (!questionObj.checkValidity()) {
        $('#questionError').val(questionMsg);
        $("#questionError").show();
        passedValidation = false;
    }

    if (passedValidation) {
        addAnAnimal();
    }
}

// Add Animal
function addAnAnimal() {
    let l_obj = {};
    let myParams = {};
    let newAnimal = {};
    
    var newId = 0;
    var oldid = Number($('#id').val());
    var animal = $('#formAddAnimalAnimal').val();
    var question = $('#formAddAnimalQuestion').val();
    var playerResponse = $("input[name='formAddAnimalAnswer']:checked").val();
    
    /* if ((animal === '') || (question === '')) {
        alert('Please fill out animal and question');
        return;
    } */

    // 0.3.23
    newId = playerAnswers(oldid);

    // Is this id already taken in the db?
    l_obj = loopIds(newId);
    if (l_obj.animal !== '') {
        // This id is taken, error out
        alert('Something is wrong. Can´t add this animal');
        return;
    }

    // Add the animal into one object
    newAnimal.id = newId;
    newAnimal.animal = animal;
    newAnimal.question = question;
    newAnimal.answer = playerResponse;
    newAnimal.keep = "0";

    $.ajax({
        type: 'POST',
        data: newAnimal,
        url: '/animalsroute/addanimal',
        dataType: 'JSON'
    }).done(function (response) {
        // Check for successful (blank) response
        if (response.msg === '') {
            location.reload(true);
            // If something goes wrong, alert the error message that our service returned
            console.log("err.msg = " + msg);
            alert('Error: ' + response.msg);
            console.log("after alert Error");
        }
    });

    populateTable();
}

function teachMeMoreAnimals(){
  let l_obj = {};
  let txt = "";
  
  $(formAddAnimal).removeClass("invisible");
 // $(formAddAnimal).addClass("visible");
  $(formAddAnimal).show();

  l_obj = loopIds(4);
  txt = l_obj.question + " " + $('#animal').val() + ' ?';
  //$('#formAddAnimalFraga').text(txt);
  $('#formAddAnimalFraga').val(txt);
  document.getElementById("addAnimalYes").focus();
}

// get MongoDB-document based on id
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
    //$('#formEttFraga').text(obj.question);
    $('#formEttFraga').val(obj.question);
}

function copyPrevious () {
    //$('#previndex').val($('#index').val());
    $('#previd').val($('#id').val());
    $('#prevquestion').val($('#question').val());
    $('#prevanimal').val($('#animal').val());
    $('#prevanswer').val($('#answer').val());
    $('#prevanswerMatchesQuestion').val($('#answerMatchesQuestion').val());
}

/* function dBugPUT () {
    let myObj = {};
    let myParams = {};

    myObj = loopIds($('#id').val());
    if (myObj.answer == 'Yes') {
        myParams.oldid = myObj.id;
        myParams.newid = Number(myObj.id) + 1;
        
        updateId(myParams);
    }
} */

// PUT
function updateId(animalid) {
    let myUrl = '/animalsroute/updateanimal/' + animalid.oldid +
                '/' + animalid.newid;
        $.ajax({
        type: 'PUT',
        data: animalid,
        url: myUrl,
        dataType: 'JSON'
        }).done(function( response ) {
            // Check for successful (blank) response
            if (response.msg === '') {
                populateTable();
            }
            else {
                alert('Error: ' + response.msg);
            }
        });
}