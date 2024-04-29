// models/tender.js
const db = require('../config/database');

const Tender = {  //tworzy obiekt tender
  getAllActive: function(callback) { //przyjmuje funkcje zwrota ktora bedzie wywolana po zakonczeniu operacji na bazie danych
    const now = new Date(); //obiekt date ktory reprezentuj aktualna date i czas
    db.query(
      'SELECT * FROM Przetargi WHERE DataRozpoczecia <= ? AND DataZakonczenia >= ?',
      [now, now],
      callback
    );
  },

  getAllClosed: function(callback) {
    const query = "SELECT * FROM Przetargi WHERE DataZakonczenia < NOW()";
    db.query(query, callback);
  },

  getById: function(id, callback) {
    db.query('SELECT * FROM Przetargi WHERE IDPrzetargu = ?', [id], callback);
  },

  create: function(tenderData, callback) { //tenderData to ta losta przekazana opisana w controlers
    const query = `
        INSERT INTO przetargi (Nazwa, Opis, DataRozpoczecia, DataZakonczenia, NazwaInstytucji, MaxWartosc)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
        tenderData.Nazwa,
        tenderData.Opis,
        tenderData.DataRozpoczecia,
        tenderData.DataZakonczenia,
        tenderData.Instytucja,
        tenderData.MaxWartosc
    ];

    db.query(query, values, callback); //callback zostanie wywołana z ewentualnym błędem jako pierwszym argumentem i wynikiem operacji jako drugim
}

};

module.exports = Tender; //eksportuje obiekt Tender aby mogl byc uzywany w innych czesciach kodu
