const express = require('express')
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js');
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

app.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    return console.log('algo errado aconteceu', err)
  }

  console.log(`server escutando na porta 3000`)
})
