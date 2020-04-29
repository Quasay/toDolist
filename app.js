const express = require("express");
const bodyParser = require("body-parser");
const model = require("./data.js");
const date = require("./date.js");
const _ = require("lodash");
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  const day = date.getDate();
  model.Item.find(function (err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      if (foundItems.length === 0) {
        model.Item.insertMany(model.defaultItems, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Succesfully saved all the items to ItemDB! :)");
          }
        });
      }

      res.render("list", { listTitle: day, items: foundItems });
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on Port 3000");
  console.log(__dirname);
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work", items: workItems });
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkBox;
  const listName = req.body.listName;
  const day = date.getDate();

  console.log(req.body);

  if (listName === day) {
    model.Item.findByIdAndDelete(checkedItemId, function (err) {
      if (!err) {
        console.log("Successfully Deleted Item!");
      } else {
        console.log(err);
      }
    });
    res.redirect("/");
  } else {
    model.List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.post("/", function (req, res) {
  const day = date.getDate();
  const itemName = req.body.newItem;
  const listName = req.body.List;

  console.log(req.body);

  var newItem = new model.Item({
    name: itemName,
  });

  if (listName === day) {
    newItem.save();
    res.redirect("/");
  } else {
    model.List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  const list = new model.List({
    name: customListName,
    items: model.defaultItems,
  });

  model.List.find({ name: customListName }, function (err, docs) {
    if (!err) {
      if (docs.length === 0) {
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", { listTitle: docs[0].name, items: docs[0].items });
      }
    } else {
      console.log(err);
    }
  });
});
