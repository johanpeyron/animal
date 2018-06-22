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
  //  animalsData = animaldata;
    databasTxt = JSON.stringify(animaldata);

    $('#dbTxt').text(databasTxt);
    $('#radEtt').val(databasTxt);
    
    // Pass the animals to johantestar.js
    shareAnimals(animaldata);
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