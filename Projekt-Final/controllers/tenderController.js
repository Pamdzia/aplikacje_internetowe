// controllers/tenderController.js
const Tender = require('../models/tender'); 
const Offer = require('../models/offer');

const tenderController = {
  list: function(req, res) {
    Tender.getAllActive(function(err, tenders) {  
      if (err) {
        res.status(500).send('Wystąpił błąd podczas pobierania przetargów');
      } else {
        res.render('tenders', { tenders }); //do wygeneriwania widoku
      }
    });
  },

  details: function(req, res) {
    const id = req.params.id; // wyciagniecie id przetargu z parametru URL
    Tender.getById(id, function(err, tender) { 
      if (err) {
        res.status(500).send('Wystąpił błąd podczas pobierania szczegółów przetargu');
      } else {
        res.render('tender-details', { tender: tender[0] }); // przekazujemy tylko pierwszy element z listy (nawet gdy mamy tylko jeden ten wiersz)
      }
    });
  },

  submitOffer: function(req, res) {
    const tenderId = req.params.id;
    const { bidderName, bidValue} = req.body;
    const bidTime = new Date();

    Tender.getById(tenderId, function(err, tenders) { //czy przetarg wciaz trwa
      if(err) {
        res.status(500).send('Wystąpił błąd podczas dodawania przetargu');
      } else if (tenders.length > 0 && new Date(tenders[0].DataZakonczenia) > bidTime) { //czy zwrocilo cokolwiek i czy jest wieksze od datyzakonczenia
        Offer.create({ tenderId, bidderName, bidValue, bidTime }, function(err, result) {
          if(err) {
            console.error(err); 
            res.status(500).send('Wystąpił błąd podczas dodawania perzetargu');
          } else {
           // wyświetlenie komunikatu i przekierowanie
           res.send(`<script>
                      alert('Oferta została pomyślnie dodana.');
                       window.location.href='/tenders';
                      </script>`);
          }
        });
      } else {
        res.status(400).send('Nie można złożyc oferty, przetarg się zakończył. ');
      }
    });
  },

  listClosed: function(req, res) {
    Tender.getAllClosed(function(err, tenders) {
      if (err) {
        res.status(500).send('Wystąpił błąd podczas pobierania zakończonych przetargów');
      } else {
        res.render('closed-tenders' , { tenders });
      }
    });
  },

  tenderOffers: function(req, res) {
    const id = req.params.id;
  
    Tender.getById(id, function(err, tenderResult) {
      if (err) {
        return res.status(500).send('Wystąpił błąd podczas pobierania szczegółów przetargu.');
      } 
  
      if (tenderResult.length === 0) {
        return res.status(404).send('Przetarg nie został znaleziony.');
      }
      
      const tender = tenderResult[0];
  
      Offer.getOffersByTenders(id, function(err, offers) {
        if (err) {
          return res.status(500).send('Wystąpił błąd podczas pobierania ofert dla przetargu.');
        }
  
        //jeśli nie ma żadnych ofert w budżecie
        if (offers.length === 0) {
          Offer.checkIfAnyOffersExceedBudget(id, function(err, result) {
            if (err) {
              return res.status(500).send('Wystąpił błąd podczas weryfikacji ofert.');
            }
  
            //czy jakiekolwiek oferty przekraczają budżet
            const offersExceedBudget = result[0].OffersExceedBudget;
            
            return res.render('tender-offers', { 
              tender: tender, 
              offers: offers, 
              allOffersExceedBudget: offersExceedBudget
            });
          });
        } else {
          // przetarg ma oferty w budżecie
          return res.render('tender-offers', { 
            tender: tender, 
            offers: offers, 
            allOffersExceedBudget: false
          });
        }
      });
    });
  },

  addTender: function(req, res) {
    const { nazwa, instytucja, opis, start, koniec, maxWartosc } = req.body;

      // konwersja daty rozpoczęcia i zakończenia na obiekty typu Date
    const startDate = new Date(start);
    const endDate = new Date(koniec);

    //walidacja: Data zakończenia musi być późniejsza niż data rozpoczęcia
    if (endDate <= startDate) {
      // jeśli data zakończenia jest wcześniejsza lub równa dacie rozpoczęcia to komunikat o błędzie
      return res.status(400).send('Data zakończenia przetargu nie może być wcześniejsza niż data rozpoczęcia.');
    }

    Tender.create({
        Nazwa: nazwa,
        Instytucja: instytucja,
        Opis: opis,
        DataRozpoczecia: new Date(start),
        DataZakonczenia: new Date(koniec),
        MaxWartosc: maxWartosc
    }, function(err) {
        if (err) {
            return res.status(500).send('Wystąpił błąd podczas dodawania przetargu');
        }
        res.redirect('/tenders');
    });
}

};

module.exports = tenderController;
