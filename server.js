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
//  Initialize express
//============================
var app = express();

// Use morgan and body-parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

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

// A Get Request to scrape the website
app.get("/scrape", function(req, res) {
  request("https://www.nytimes.com/", function(error, response, html) {
    var $ = cheerio.load(html);

    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as a properties of the result object
      result.title = $(this).children("a").text();
      result.ink = $(this).children("a").attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log(doc);

        }
      });
    });
  });
  res.send("Scrape Complete. ");
});

// Need to get all the articles from that we scrape from mongodb
app.get("/articles", function(req, res) {
  // Grab every doc on the Article array
  Article.find({}, function(error, doc) {
    // If there's any error will going to console log the error
    if (error) {
      console.log(error);
    }
    //If there's no error will send the json object to the browser
    else {
      res.json(doc);
    }
  });
});

// Need to get an article by a specific id
app.get("/articles/:id", function(req, res) {
  // Find all the articles related to the specific id
  //found on the url
  Article.findOne({
      "_id": req.params.id
    })
    // Populate all the note associated with it
    .populate("note")
    // Now execute our query
    .exec(function(error, doc) {
      // log if there's any erro
      if (error) {
        console.log(error);
      } else {
        // Send the Json to the browser
        res.json(doc);
      }
    });
});

// Create a new note or replace an existing one
app.post("/articles/:id", function(req, res){
  // Create a new Note sending the req.body
  var newNote = new Note(req.body);
  // Save the note to the db
  newNote.save(function(error, doc){
    // Console any error
    if(error){
      console.log(error);
    }
    else{
      // Find the article using the id
      Article.findOne({
        "id": req.params.id
      },
    {
      "note": doc._id
    })
    // Execute the query
    .exec(function(err, doc){
      // Look for errors
      if(err){
        console.log(err);
      }
      // Send the doc to the browser
      else {
        res.send(doc);
      }
    });
    }
  });
});

// Listen on Port
app.listen(3000, function(){
  console.log("App Listening on Port 3000");
});
