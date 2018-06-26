const request = require('request')
const path = require('path')
//const views = require('./views/endpoints.html')

let appRouter = (app) => {
  app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname+'/views/endpoints.html'));
  });

  app.get('/lerReadme/:nome/:repo', (req, res) => {
    const reqGit = {
      headers: {
        'User-Agent': 'GitHub-Researcher-API'
      },
      method: 'GET',
      uri: `https://api.github.com/repos/${req.params.nome}/${req.params.repo}/readme`
    };

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

  app.get('/repos/:nome/', (req, res) => {
    const reqGit = {
      headers: {
        'User-Agent': 'GitHub-Researcher-API'
      },
      method: 'GET',
      uri: `https://api.github.com/users/${req.params.nome}/repos`
    };

    request(reqGit, (err, resp) => {
      console.log(reqGit.uri);
      console.log('erro:', err);
      console.log('statusCode:', resp && resp.statusCode);
      let itens = JSON.parse(resp.body);
      let obj = {};
      let objs = []
      for(let i=0; i<itens.length; i++){
        obj.id = itens[i].id;
        obj.nome = itens[i].name;
        objs.push(obj);
        obj = {};
      }
      console.log(objs);
      res.json(objs);
    });

  });

  app.get('/autentica/:nome/:senha', (req, res) => {

    const reqUser = {
      headers: {
        'User-Agent': 'GitHub-Researcher-API',
        'Authorization': 'Basic ' + Buffer.from(req.params.nome + ':' + req.params.senha).toString('base64')
      },
      method: 'GET',
      uri: 'https://api.github.com/user'
    };

    console.log(reqUser.headers['Authorization']);

    request(reqUser, (err,resp) => {
      console.log(reqUser.uri);
      console.log('erro: ', err);
      console.log('statusCode:', resp && resp.statusCode);
      let obj = {};
      obj.id = JSON.parse(resp.body).id;
      obj.login = JSON.parse(resp.body).login;
      obj.name = JSON.parse(resp.body).name;
      obj.avatar = JSON.parse(resp.body).avatar_url;
      obj.bio = JSON.parse(resp.body).bio;
      //console.log(obj);
      console.log(resp.body);
      console.log("id do usuário: ",obj.id)
      res.json(resp.body);
    });

  });

  app.get('/autentica', (req,res) => {

    console.log(req.headers);

    let user = req.headers['user'].split(':')[0];
    let pass = req.headers['user'].split(':')[1];

    console.log(user);
    console.log(pass);

    const reqUser = {
      headers: {
        'User-Agent': 'GitHub-Researcher-API',
        'Authorization': 'Basic ' + Buffer.from(user + ':' + pass).toString('base64')
      },
      method: 'GET',
      uri: 'https://api.github.com/user'
    };

    request(reqUser, (err,resp) => {
      console.log(reqUser.uri);
      console.log('erro: ', err);
      console.log('statusCode:', resp && resp.statusCode);
      let obj = {};
      obj.id = JSON.parse(resp.body).id;
      obj.login = JSON.parse(resp.body).login;
      obj.name = JSON.parse(resp.body).name;
      obj.avatar = JSON.parse(resp.body).avatar_url;
      obj.bio = JSON.parse(resp.body).bio;
      console.log(obj);
      res.json(obj);
    });
  });

}

module.exports = appRouter;
