var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
  itemName: String,
  itemDesc: String,
  itemPrice: Number,
  itemTags: [String]
});

var receiptSchema = new mongoose.Schema({
  name: String,
  date: Date,
  store: String,
  category: String,
  items: [itemSchema],
  tags: [String]
});

mongoose.model('Receipt', receiptSchema, 'Slips');
//  The name of the model
//  The schema to use
//  MongoDB collection name (optional)
