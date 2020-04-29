const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/todolistDB", 
{useNewUrlParser: true, useUnifiedTopology: true})

const itemSchema = new mongoose.Schema({
  name: String
})

const listSchema = {
  name: String,
  items: [itemSchema]
}

const List = mongoose.model("List", listSchema)
const Item = mongoose.model("Item", itemSchema)

const hw = new Item({
  name: "Need to finish HW"
})
const shopping = new Item({
  name: "Buy milk + eggs"
})
const gym = new Item({
  name: "Need to lift tonight"
})


exports.Item = Item
exports.List = List 
exports.defaultItems = [hw,shopping,gym]


