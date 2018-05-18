const express = require('express')
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js');
const app = express()

let port = process.env.PORT || 80;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

app.listen(port, (err) => {
  if (err) {
    return console.log('algo errado aconteceu', err)
  }

  console.log(`server escutando na porta ${port}`);
})
