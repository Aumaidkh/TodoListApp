//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Connecting mongoose
mongoose.connect("mongodb+srv://admin-aumaid:passw0rdFr33@cluster0.u4vel.mongodb.net/todoListDB", {useNewUrlParser: true})


//Creating Item Schema
const itemsSchema = new mongoose.Schema(
  {
    name: String
  }
)

//Creating a mongoose model
const Item = mongoose.model("Item", itemsSchema);

//Creating docs
const item1 = new Item({
    name: "Welcome to the TodoList"
  });

const item2 = new Item( {
  name: "Hit the + Button to add"
});

const item3 = new Item ({
  name: "Hit anything"
});

//Array of documents that is to be saved
const defaultsItems = [item1,item2,item3];

///////////////
const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {


  //getting items from mongooose
  Item.find({}, function(err, foundItems){

    //if items collection empty then we render the default items
    if(foundItems.length === 0) {
      //Inserting the collection into the database
      Item.insertMany(defaultsItems, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Items Added To The Database");
        }
      });
      res.redirect("/");
    }
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  //Creating a new Item document
  const item = new Item({
    name: itemName
  });

  //checking if the route came from a custom list route
  if( listName === "Today"){
    //insert it into Database
    item.save();
    res.redirect("/");

  } else {
    //we first need to search the list for the item then send it to the ejs
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    });
  }


});

//Deleting an item when it is checked
app.post("/delete", function(req, res){
  console.log(req.body.checkbox);
  //getting the id of the item
  const item_id = req.body.checkbox;
  const list_name = req.body.listName;

  //checking if the item is to be deleted from default list
  if(list_name === "Today"){
    //deleting the item with id = item_id
    Item.deleteOne({_id: item_id}, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Successfully deleted the item");
        res.redirect("/");
      }
    });
  }else {
    //request is coming from the custom list with list name = list_name
    //we first need to go to that list document and delete the item with that id
    List.findOneAndUpdate({name: list_name},
       {
         $pull: {items: {_id: item_id}}
       }, function(err){
         if(!err){
           res.redirect("/"+list_name);
         }
       })

  }

});

//creating a dynamic route
app.get("/:customListName", function(req,res){
  //saving the param
  const customListName = _.capitalize(req.params.customListName);

  //checking if the list already exists with name customListName
  if(List.findOne({name:customListName}, function(err, foundList){
    if(err){
      console.log(err);
    }else{
      if(!foundList){
        console.log("Doesn't exist");
        //create a new List
        const list = new List({
          name: customListName,
          items: defaultsItems
        });
        list.save();
        //redirecting the user to the current route
        res.redirect("/"+customListName);

      }else{
        console.log("Exists");
        //Show existing list
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  }));


});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

//Setting port for heroku
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
