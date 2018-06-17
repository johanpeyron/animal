// ====================   Functions   ========================================

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
    return a - b
  });
  $('#minId').val(arrId[0]);

  // display max value
  arrId.reverse();
  $('#maxId').val(arrId[0]);
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

// Small helper functions=========================================================
$("#btnFormEttYes").click(function () {
  var txt1 = 'Do you want to play a game?';
  var txt2 = 'Think of an animal and let me guess which one. Press Yes-button to start.';

  // Player clicks Yes for the first time
  if ($('#formEttFraga').text() == txt1) {
    $('#formEttFraga').text(txt2);
  }
});

$("#radTva").click(function () {
  $(formAddAnimal).val(countQuestions());
});

$("#btnToggleFormDbug").click(function () {
  $(formDbug).toggle();
});

$("#btnToggleFormAddAnimal").click(function () {
  $(formAddAnimal).toggle();
});

// closure, creating global counter
// invoke with countQuestions();
var countQuestions = (function () {
  var counter = 0;
  return function () {
    counter += 1;
    return counter;
  }
})();