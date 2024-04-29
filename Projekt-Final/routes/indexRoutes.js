const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const tenderController = require('../controllers/tenderController'); 

router.get('/', (req, res) => {
  res.render('index'); 
});

router.get('/tenders', tenderController.list);

router.get('/tender/:id', tenderController.details);

router.post('/submit-tender/:id', tenderController.submitOffer);

router.get('/closed-tenders', tenderController.listClosed);

router.get('/tender-offers/:id', tenderController.tenderOffers)

// trasa GET, która wyświetla formularz dodawania przetargu
router.get('/add-tender', function(req, res) {
  res.render('add-tender');
});

// trasa POST, która obsługuje dane przesłane z formularza
router.post('/add-tender', tenderController.addTender);

module.exports = router;
