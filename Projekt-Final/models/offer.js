// models/offer.js

const db = require('../config/database');

const Offer = {
    create: function({ tenderId, bidderName, bidValue, bidTime }, callback) {
        const query = 'INSERT INTO oferty (IDPrzetargu, NazwaSkladajacego, WartoscOferty, DataZlozenia) VALUES (?, ?, ?, ?)';
        db.query(query, [tenderId, bidderName, bidValue, bidTime], callback)
    },

    getOffersByTenders: function(tenderId, callback) {
        const query = `
          SELECT o.* 
          FROM oferty o
          INNER JOIN przetargi t ON o.IDPrzetargu = t.IDPrzetargu
          WHERE o.IDPrzetargu = ? AND o.WartoscOferty <= t.MaxWartosc
          ORDER BY o.WartoscOferty ASC
        `;
        db.query(query, [tenderId], callback);
    },

    checkIfAnyOffersExceedBudget: function(tenderId, callback) {
        const query = `
          SELECT EXISTS (
            SELECT 1 
            FROM oferty 
            WHERE IDPrzetargu = ? AND WartoscOferty > (SELECT MaxWartosc FROM przetargi WHERE IDPrzetargu = ?)
          ) AS OffersExceedBudget
        `;
        db.query(query, [tenderId, tenderId], callback);
      }
};

module.exports = Offer;