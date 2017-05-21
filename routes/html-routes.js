var db = require ("../config/connection");
var Article = require("../models/Article");

module.exports = function(app){
  app.get("/", function(req, res){
    res.render("home");
  });

  app.get("/saved", function(req, res){
    Article.find({
      saved: true
    }).populate("articles").exec(function(err, doc){
      if (err){
        console.log(err);
      }else{
        res.render("saved", {
          docs: doc
        });
      }
    });
  });

  app.get("/populate", function(req, res){
    Article.find({}).populate("articles").exec(function(err, doc){
      if(err){
        console.log(err);
      }
      else{
        res.render("index", {
          docs: doc
        });
      }
    });
  });
}
