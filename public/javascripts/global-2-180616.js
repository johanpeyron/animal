// Global variable with the entire animals collection
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the user table on initial page load
  populateTable();

});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // jQuery AJAX call getting some animals
  $.getJSON( '/animalsroute/animals', function( animaldata ) {
  
    // Animals data array for animals collection
    var animalsListData = [];
    var databasTxt = '';

    // nodetest2.animalDB.animals
    animalsListData = animaldata;
    databasTxt = JSON.stringify(animalsListData);

    //$('#animalAnswer2').text = JSON.stringify(animalsListData);
    //$('#description').text = JSON.stringify(animalsListData);
    $('#dbTxt').text(databasTxt);
    $('#radEtt').val(databasTxt);
    
    });
}

