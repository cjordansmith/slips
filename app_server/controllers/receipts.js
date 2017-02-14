/*   GET 'home' page   */
module.exports.homelist = function(req, res) {
  res.render('receipts-list', {
    title: 'Slips - Organize your receipts',
    pageHeader: {
      title: 'Slips',
      strapline: 'Organize your receipts'
    },
    receipts: [{
      name: 'Oxygen25',
      date: '2011-07-17',
      total: 142.00,
      store: 'Guitar Center',
      tags: ['equipment', 'keyboard', 'midi']
    },{
      name: 'Twitch',
      date: '2012-07-27',
      total: 358.53,
      store: 'Best Buy',
      tags: ['equipment', 'dj', 'midi']
    }]
  });
};

/*   GET 'Receipt Info' page   */
module.exports.receiptInfo = function(req, res) {
  res.render('receipt-info', { title: 'Receipt Info'});
};

/*   GET 'Add item' page   */
module.exports.addItem = function(req, res) {
  res.render('receipt-item-form', { title: 'Add item'});
};
