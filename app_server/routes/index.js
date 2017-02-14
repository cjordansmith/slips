var express = require('express');
var router = express.Router();
var ctrlReceipts = require('../controllers/receipts');
var ctrlOthers = require('../controllers/others');

/*   Receipts pages   */
router.get('/', ctrlReceipts.homelist);
router.get('/receipt', ctrlReceipts.receiptInfo);
router.get('/receipt/item/new', ctrlReceipts.addItem);

/*   Other pages   */
router.get('/about', ctrlOthers.about);

module.exports = router;
