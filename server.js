const express = require('express')
const request = require('request')
const app = express()
const useragent = require('express-useragent')
const port = 3000

app.use(useragent.express());

let obj = {}

app.get('/', (req, resp) => {
  //resp.send('Olá usuário, eu sou o server teste para consumir a API do Git!\n\n')
  resp.json(obj);
})

const reqGit = {
  headers: {
    'User-Agent': 'My-Training-API-Git-App'
  },
  method: 'GET',
  uri: 'https://api.github.com/repos/Lerissonf/IA-projeto2/readme'
}

request(reqGit, (err, resp) => {
  console.log('erro:', err);
  console.log('statusCode:', resp && resp.statusCode);
  console.log(JSON.parse(resp.body).name);
  obj = resp.body;
});

app.listen(port, (err) => {
  if (err) {
    return console.log('algo errado aconteceu', err)
  }

  console.log(`server escutando na porta ${port}`)
})
