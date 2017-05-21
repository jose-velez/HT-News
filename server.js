//================================
//    Dependencies
//================================

var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Note = require("./models/notes.js");
var Article = require("./models/articles.js");
var cheerio = require("cheerio");
var request = require("request");

mongoose.Promise = Promise;

//============================
var PORT = process.env.PORT || 3000;

//============================
//  Initialize express
//============================
var app = express();

// Use morgan and body-parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));

app.set("view engine", "handlebars");

// Make Public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/mongooseticles");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection succesful. ");
});


//=========================
//      Routes
//=========================

require("./routes/html-routes")(app);
require("./routes/api-routes");
// Listen on Port
app.listen(PORT, function(){
  console.log(`App running on port: ${PORT}`);
});
