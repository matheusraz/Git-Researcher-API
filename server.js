const express = require('express')
const request = require('request')
const app = express()
const useragent = require('express-useragent')
const port = 3000

app.use(useragent.express());

app.get('/', (req, resp) => {
  resp.send('Olá usuário, eu sou o server teste para consumir a API do Git!')
})

const reqGit = {
  header: 'MyTrainingAPIGitApp',
  method: 'GET',
  uri: 'https://api.github.com/repos/Lerissonf/IA-projeto2/readme'
}

request(reqGit, (err, resp, body) => {
  console.log('erro:', err);
  console.log('statusCode:', resp && resp.statusCode);
  console.log(body);
});

app.listen(port, (err) => {
  if (err) {
    return console.log('algo errado aconteceu', err)
  }

  console.log(`server escutando na porta ${port}`)
})
