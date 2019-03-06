const mongoose = require('mongoose');

// *********** Connect to Mongo  ***********
console.log('Attempting to connect to mongoose');

mongoose.connect("mongodb://admin:admin1234@ds125881.mlab.com:25881/multiplayergame", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to Mongo database!");
  })
  .catch(err => {
    console.error("App starting error:", err.stack);
  });