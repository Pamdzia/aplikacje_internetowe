const express = require('express');
const db = require('./config/database'); // import modułu połączenia z bazą danych

const app = express();

app.use(express.urlencoded({ extended: true })); // musi byc jak mam formularze z post!!!
app.use(express.static('public')); //do tego zeby mozna bylo css dac (do plikow statycznych)

app.set('view engine', 'ejs'); // używanie EJS jako systemu szablonów

app.use(express.json());

const indexRoutes = require('./routes/indexRoutes');
app.use('/', indexRoutes);

const port = 3001;
app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
