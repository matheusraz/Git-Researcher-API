const request = require('request')

let appRouter = (app) => {
  app.get('/lerReadme/:nome/:repo', (req, res) => {
    const reqGit = {
      headers: {
        'User-Agent': 'GitHub-Researcher-API'
      },
      method: 'GET',
      uri: `https://api.github.com/repos/${req.params.nome}/${req.params.repo}/readme`
    }

    request(reqGit, (err, resp) => {
      console.log(reqGit.uri);
      console.log('erro:', err);
      console.log('statusCode:', resp && resp.statusCode);
      let obj = JSON.parse(resp.body);
      console.log(obj);
      obj.content = new Buffer(obj.content, 'base64').toString()
      res.json(obj);
    });

  });

  app.get('autentica/:nome/:senha', (req, res) => {
    let user = new Buffer(`${req.params.nome} : ${req.params.senha}`)
    let encodedAuth = user.toString('Base64');
    console.log(encodedAuth);
    
    const reqUser = {
      headers: {
        'Authorization': 'Basic ' + encodedAuth
      },
      method: 'GET',
      uri: 'https://api.github.com/user'
    }

    request(req, (err,resp) => {
      console.log(req.uri);
      console.log('erro: ', err);
      console.log('statusCode:', resp && resp.statusCode);
      let obj = JSON.parse(resp.body);
      console.log(obj);
    });

  });

}

module.exports = appRouter;
