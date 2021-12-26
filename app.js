const express = require("express");
const bodyParser = require("body-parser");
//since the module is local
const date = require(__dirname+"/date.js");

const app = express();

const items = [];
const workItems = [];

//declaring ejs for templating
app.set('view engine', 'ejs');

//setting bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));

//defining path of static files for express
app.use(express.static("public"));

app.get("/", function(req, res) {

  res.render("list", {
    listTitle: date.getDay(),
    newListItems: items
  });

});

//handling post request for work route
app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.post("/work", function(req, res) {
  console.log(req.body);
  let item = req.body.item;
  workItems.push(item);
  res.redirect("/work")
});

//handling add item post request
app.post("/", function(req, res) {
  let item = req.body.item;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }

});

//Starting the server on port 3000
app.listen(3000, function() {
  console.log("Server is started on port 3000");
})
