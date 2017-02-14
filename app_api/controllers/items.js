var mongoose = require('mongoose');
var Loc = mongoose.model('Receipt');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* POST a new item, providing a receiptid */
/* /api/receipts/:receiptid/items */
module.exports.itemsCreate = function(req, res) {
  var receiptid = req.params.receiptid;
  if (receiptid) {
    Loc
      .findById(receiptid)
      .select('items')
      .exec(
        function(err, receipt) {
          if (err) {
            sendJSONresponse(res, 400, err);
          } else {
            doAddItem(req, res, receipt);
          }
        }
    );
  } else {
    sendJSONresponse(res, 404, {
      "message": "Not found, receiptid required"
    });
  }
};

var doAddItem = function(req, res, receipt) {
  if (!receipt) {
    sendJSONresponse(res, 404, "receiptid not found");
  } else {
    receipt.items.push({
      itemName: req.body.itemName,
      itemDesc: req.body.itemDesc,
      itemPrice: req.body.itemPrice,
      itemTags: req.body.itemTags.split(",")
    });
    receipt.save(function(err, receipt) {
      var thisItem;
      if (err) {
        sendJSONresponse(res, 400, err);
      } else {
        thisItem = receipt.item[receipt.item.length - 1];
        sendJSONresponse(res, 201, thisItem);
      }
    });
  }
};

module.exports.itemsUpdateOne = function(req, res) {
  if (!req.params.receiptid || !req.params.itemid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, receiptid and itemid are both required"
    });
    return;
  }
  Loc
    .findById(req.params.receiptid)
    .select('items')
    .exec(
      function(err, receipt) {
        var thisItem;
        if (!receipt) {
          sendJSONresponse(res, 404, {
            "message": "receiptid not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        if (receipt.items && receipt.items.length > 0) {
          thisItem = receipt.items.id(req.params.itemid);
          if (!thisItem) {
            sendJSONresponse(res, 404, {
              "message": "itemid not found"
            });
          } else {
            thisItem.itemName = req.body.itemName;
            thisItem.itemDesc = req.body.itemDesc;
            thisItem.itemPrice = req.body.itemPrice;
            thisItem.itemTags = req.body.itemTags.split(",");
            receipt.save(function(err, receipt) {
              if (err) {
                sendJSONresponse(res, 404, err);
              } else {
                sendJSONresponse(res, 200, thisItem);
              }
            });
          }
        } else {
          sendJSONresponse(res, 404, {
            "message": "No item to update"
          });
        }
      }
  );
};

module.exports.itemsReadOne = function(req, res) {
  if (req.params && req.params.receiptid && req.params && req.params.itemid) {
    Loc
      .findById(req.params.receiptid)
      .select('name items')
      .exec(
        function(err, receipt) {
          var response, item;
          if (!receipt) {
            sendJSONresponse(res, 404, {
              "message": "receiptid not found"
            });
            return;
          } else if (err) {
            sendJSONresponse(res, 404, err);
            return;
          }
          if (receipt.items && receipt.items.length > 0) {
            item = receipt.items.id(req.params.itemid);
            if (!item) {
              sendJSONresponse(res, 404, {
                "message": "itemid not found"
              });
            } else {
              response = {
                receipt : {
                  name : receipt.name,
                  id : req.params.receiptid
                },
                item : item
              };
              sendJSONresponse(res, 200, response);
            }
          } else {
            sendJSONresponse(res, 404, {
              "message": "No items found"
            });
          }
        }
    );
  } else {
    sendJSONresponse(res, 404, {
      "message": "Not found, receiptid and itemid are both required"
    });
  }
};

// app.delete('/api/receipts/:receiptid/items/:itemid'
module.exports.itemsDeleteOne = function(req, res) {
  if (!req.params.receiptid || !req.params.itemid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, receiptid and itemid are both required"
    });
    return;
  }
  Loc
    .findById(req.params.receiptid)
    .select('items')
    .exec(
      function(err, receipt) {
        if (!receipt) {
          sendJSONresponse(res, 404, {
            "message": "receiptid not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        if (receipt.items && receipt.items.length > 0) {
          if (!receipt.items.id(req.params.itemid)) {
            sendJSONresponse(res, 404, {
              "message": "itemid not found"
            });
          } else {
            receipt.items.id(req.params.itemid).remove();
            receipt.save(function(err) {
              if (err) {
                sendJSONresponse(res, 404, err);
              } else {
                sendJSONresponse(res, 204, null);
              }
            });
          }
        } else {
          sendJSONresponse(res, 404, {
            "message": "No item to delete"
          });
        }
      }
  );
};
