var myAnimals = [
     { "id" : "0", "animal" : "fraga1", "question" : "Do you want to play a game?", "answer" : "Yes", "keep" : "1" },
     { "id" : "1", "animal" : "fraga2", "question" : "Think of an animal and let me guess. Press Yes to start", "answer" : "Yes", "keep" : "1" },
     { "id" : "4", "animal" : "addanimal1", "question" : "Let me guess: Are you thinking of a", "answer" : "Yes", "keep" : "1" },
     { "id" : "5", "animal" : "addanimal2", "question" : "I could guess your animal! Do you want to play again?", "answer" : "Yes", "keep" : "1" },
     { "id" : "6", "animal" : "addanimal2", "question" : "Please tell me your animal! And a question to separate it from a", "answer" : "Yes", "keep" : "1" },
     { "id" : "8", "animal" : "Python", "question" : "Can this animal be a pet?", "answer" : "Yes", "keep" : "1" }
  ];

try {
  db.animals.drop();
  db.createCollection('animals');
  db.animals.insertMany( myAnimals);
} catch (e) {
  print (e);
}