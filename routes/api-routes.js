var request = require("reques");
var cheerio = require("cheerio");
var db = require("../config/connection");


module.exports = function(app){
  app.post("/savenote/:id", function(req, res){
    var noteId = req.params.id;
    db.myModel.Note.findOneAndUpdate({
      "_id": noteId
    }, {
      "saved": true
    }, function(err, doc){
      if(err){
        console.log(err);
        return res.status(500).end();
      }
      res.status(200).json({sucess: true});
    });
  });
  app.get("/scrape", function(req, res){
    request("https://www.nytimes.com/", function(error, response, html){
      var $ = cheerio.load(html);
      var data = {};
      data.title = $(this).children("a").text().trim();
      data.link = $(this).children("a").attr("href");

      data.push(data);

      var entry = new db.myModel.Article(data);

      entry.save(function(err, doc){
        if(err){
          console.log(err);
        }
        else {

        }
      });
    });
    res.redirect("/populate");
  });
};
