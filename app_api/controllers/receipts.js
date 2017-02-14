var mongoose = require('mongoose');
var Loc = mongoose.model('Receipt');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.receiptsList = function(req, res) {
  console.log('Finding receipt details', req.params);
  if (req.params && req.params.receiptid) {
    Loc
      .findById(req.params.receiptid)
      .exec(function(err, receipt) {
        if (!receipt) {
          sendJSONresponse(res, 404, {
            "message": "receiptid not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(receipt);
        sendJSONresponse(res, 200, receipt);
      });
  } else {
    console.log('No receiptid specified');
    sendJSONresponse(res, 404, {
      "message": "No receiptid in request"
    });
  }
};

module.exports.receiptsReadOne = function(req, res) {
  if (req.params && req.params.receiptid && req.params) {
    Loc
      .findById(req.params.receiptid)
      .exec(function(err, receipt) {
        if (!receipt) {
          sendJSONresponse(res, 404, {
            "message": "receiptid not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 404, err);
          return;
        }
        sendJSONresponse(res, 200, receipt);
      });
  } else {
    sendJSONresponse(res, 404, {
      "message": "No receiptid in request"
    });
  }
};

module.exports.receiptsCreate = function(req, res) {
  console.log(req.body);
  Loc.create({
    name: req.body.name,
    date: req.body.date,
    store: req.body.store,
    category: req.body.category,
    items: {
      itemName: req.body.itemName,
      itemDesc: req.body.itemDesc,
      itemPrice: req.body.itemPrice,
      itemTags: req.body.itemTags,
    },
    tags: req.body.tags.split(",")
  }, function(err, receipt) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(receipt);
      sendJSONresponse(res, 201, receipt);
    }
  });
};

module.exports.receiptsUpdateOne = function(req, res) {
  if (!req.params.receiptid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, receiptid is required"
    });
    return;
  }
  Loc
    .findById(req.params.receiptid)
    .select('-items -rating')
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
        receipt.name = req.body.name;
        receipt.date = req.body.date;
        receipt.store = req.body.store;
        receipt.category = req.body.category;
        receipt.items = {
          itemName: req.body.itemName,
          itemDesc: req.body.itemDesc,
          itemPrice: req.body.itemPrice,
          itemTags: req.body.itemTags,
        };
        receipt.tags = req.body.tags.split(",");
        receipt.save(function(err, receipt) {
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            sendJSONresponse(res, 200, receipt);
          }
        });
      }
  );
};

module.exports.receiptsDeleteOne = function(req, res) {
  var receiptid = req.params.receiptid;
  if (receiptid) {
    Loc
      .findByIdAndRemove(receiptid)
      .exec(
        function(err, receipt) {
          if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          console.log("Receipt id " + receiptid + " deleted");
          sendJSONresponse(res, 204, null);
        }
    );
  } else {
    sendJSONresponse(res, 404, {
      "message": "No receiptid"
    });
  }
};
