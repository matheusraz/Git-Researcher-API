const express = require('express')
const request = require('request')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  const reqGit = {
    headers: {
      'User-Agent': 'GitHub-Researcher-API'
    },
    method: 'GET',
    uri: `https://api.github.com/repos/${req.query.name.toString()}/${req.query.repo.toString()}/readme`
  }

  request(reqGit, (err, resp) => {
    console.log(reqGit.uri);
    console.log('erro:', err);
    console.log('statusCode:', resp && resp.statusCode);
    let obj = JSON.parse(resp.body);
    console.log(obj);
    let result = new Buffer(obj.content, 'base64')
    res.send(result.toString());
  });


})

app.listen(port, (err) => {
  if (err) {
    return console.log('algo errado aconteceu', err)
  }

  console.log(`server escutando na porta ${port}`)
})
