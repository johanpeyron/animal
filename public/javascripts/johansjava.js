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

$("#btnDebugMode").click(function () {
    debugShow();
});

$("#btnResetDB").click(function () {
    resetDB();
});

// Remember that button addAnimalYes was clicked
$( "#addAnimalYes" ).click( function() {
  let btn = $( "#addAnimalYes" )[ 0 ];
  jQuery.data( btn, "clicked", true );
});
// ====================   Functions   =========================================

function addAnAnimal() {
    let obj = {};
    let myParams = {};
    let newAnimal = {};
    
    let newId = 0;
    let oldid = Number($('#id').val());
    let animal = $('#formAddAnimalAnimal').val();
    let question = $('#formAddAnimalQuestion').val();
    let response = $("input[name='formAddAnimalAnswer']:checked").val();
    
    newId = playerResponse(oldid);

    // Is this id already taken in the db?
    obj = loopIds(newId);
    if (obj.animal !== '') {
        // This id is taken, error out
        alert('Something is wrong. Can´t add this animal');
        return;
    }

    // Add the animal into one object
    newAnimal.id = newId;
    newAnimal.animal = animal;
    newAnimal.question = question;
    newAnimal.answer = response;
    newAnimal.keep = "0";

    $.ajax({
        type: 'POST',
        data: newAnimal,
        url: '/animalsroute/addanimal',
        dataType: 'JSON'
    }).done(function (res) {
        if (response.msg === '') {
            //location.reload(true);
            //return;
        } else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });

    populateTable();
}

function addAnimalShow () {
    $('#formAddAnimalAnimal').val();
    $('#formAddAnimalQuestion').val();
    $("#formAddAnimal").show();
}

function animalValidation() {
    let animalObj = document.getElementById("formAddAnimalAnimal");
    let questionObj = document.getElementById("formAddAnimalQuestion");
    let animalMsg = "Please write an animal";
    let questionMsg = "Please write a question";
    let passedValidation = true;
    
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

function askQuestion (obj) {
    //$('#index').val(obj.index);
    $('#id').val(obj.id);
    $('#animal').val(obj.animal);
    $('#answer').val(obj.answer);
    $('#question').val(obj.question);
    //$('#formEttFraga').text(obj.question);
    $('#formEttFraga').val(obj.question);
}

function debugHide () {
    $('#dbTxt').hide();
    $('#btnResetDB').hide();
    $("#formDbug").hide();
    $("#formAddAnimal").hide();
}

function debugShow () {
    $('#dbTxt').show();
    $('#btnResetDB').show();
    $("#formDbug").show();
    addAnimalShow();
}

// get MongoDB-document based on id
function loopIds (val) {
    let obj = {};
    
    for (let i = 0; i < gAdata.length; i++) {
        if (gAdata[i].id == val) {
            obj.id = gAdata[i].id;
            //obj.index = i;
            obj.animal = gAdata[i].animal;
            obj.answer = gAdata[i].answer;
            obj.question = gAdata[i].question;

            return obj;
        }
    }
    // No match found, return empty object
    obj.id = 0;
    obj.animal = "";
    obj.answer = "";
    obj.question = "";
    
    return obj;
}

// Fill table with data
function populateTable() {
    debugHide();
    // Get the animals
    $.getJSON( '/animalsroute/animals', function( animaldata ) {
        let databasTxt = '';
        databasTxt = JSON.stringify(animaldata);
        
        $('#dbTxt').text(databasTxt);
        $('#radEtt').val(databasTxt);
        gAdata = animaldata;
        
        if (gAdata[0] !== undefined) {
            $('#id').val(gAdata[0].id);
            $('#formEttFraga').val(gAdata[0].question);
        }
    });
    document.getElementById("btnFormAskYes").focus();
}

function playGame(button) {
    obj = {};
    l_id = 0;
    txt = "";

    // Remember what putton was pressed
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
        obj = loopIds(l_id);
        askQuestion(obj);
        return;
    }
    
    // Respond to a question
    l_id = Number($('#id').val());
    
    l_id = playerResponse(l_id);

    obj = loopIds(l_id);
    if (obj.id != "") {
        askQuestion(obj);
    } else {
        teachMeMoreAnimals();
    }
}

function playerResponse(nr) {
    let idNr = 0;
    idNr = ('Yes' == $('#playerSays').val()) ? 2 * nr : (2 * nr) + 1;
    return idNr;
}

// Homage to Marcus G.
function yesOrNo(button) {
    let obj = {};
    let l_id = 0;
    let txt = "";
    let btn = $( "#addAnimalYes" )[ 0 ];

    addAnimalShow();

    // Has button addAnimalYes been clicked already?
    // Restart game if player presses 'Yes'
    if (jQuery.data( btn, "clicked" ) && "Yes" == button) {
        populateTable();
    }
    
    l_id = (button == "Yes") ? 5 : 6;

    obj = loopIds(l_id);
    txt = obj.question;
    if (6 == l_id) {
       txt += " "+ $('#animal').val() ;
       document.getElementById("formAddAnimalAnimal").focus();
    }
    
    $('#formAddAnimalFraga').val(txt);
}

// Reset db to initial state
function resetDB() {
    $.ajax({
        type: 'DELETE',
        url: '/animalsroute/resetdb'
    }).done((res) => {
        if (res.msg === '') {} else {
          alert('Error: ' + res.msg);
        }

        // Go get fresh data
        populateTable();
    });
}

function teachMeMoreAnimals(){
  let obj = {};
  let txt = "";
  
  //$(formAddAnimal).removeClass("invisible");
  addAnimalShow();

  obj = loopIds(4);
  txt = obj.question + " " + $('#animal').val() + ' ?';
  $('#formAddAnimalFraga').val(txt);
  document.getElementById("addAnimalYes").focus();
}


