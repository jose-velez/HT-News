var mongoose =  require("mongoose");
var Note = require("../models/Note");
var Article = require("../models/Article");


mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/mongooseticles");
var db = mongoose.conection;

db.on("error", function(error){
  console.log("Mongoose Error: ", error);
});

db.once("open", function(){
  console.log("Mongoose connection successful.");
});

db.myModel = {
  Note: Note,
  Article: Article
};

module.exports = db;
