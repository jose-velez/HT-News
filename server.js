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

      entry.save(function(err, doc){
        if(err){
          console.log(err);
        }
        else {
            console.log(doc);

        }
      });
    });
  });
  res.send("Scrape Complete. ");
});
