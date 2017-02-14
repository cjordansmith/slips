var express = require('express');
var router = express.Router();
var ctrlReceipts = require('../controllers/receipts');
var ctrlItems = require('../controllers/items');

//  receipts
router.get('/receipts', ctrlReceipts.receiptsList);
router.post('/receipts', ctrlReceipts.receiptsCreate);
router.get('/receipts/:receiptid', ctrlReceipts.receiptsReadOne);
router.put('/receipts/:receiptid', ctrlReceipts.receiptsUpdateOne);
router.delete('/receipts/:receiptid', ctrlReceipts.receiptsDeleteOne);

//  items
router.post('/receipts/:receiptid/items', ctrlItems.itemsCreate);
router.get('/receipts/:receiptid/items/:itemid', ctrlItems.itemsReadOne);
router.put('/receipts/:receiptid/items/:itemid', ctrlItems.itemsUpdateOne);
router.delete('/receipts/:receiptid/items/:itemid', ctrlItems.itemsDeleteOne);

module.exports = router;
