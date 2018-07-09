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
      let obj = {}
      obj.name = JSON.parse(resp.body).name
      obj.content = new Buffer(JSON.parse(resp.body).content, 'base64').toString()
      console.log(obj);
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
        obj.name = itens[i].full_name;
        obj.userId = itens[i].owner.id;
        obj.description = itens[i].description;
        obj.language = itens[i].language;
        obj.createdAt = itens[i].created_at;
        objs.push(obj);
        obj = {};
      }
      console.log(objs);
      res.json(objs);
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
      obj.email = JSON.parse(resp.body).email;
      obj.avatar = JSON.parse(resp.body).avatar_url;
      obj.bio = JSON.parse(resp.body).bio;
      console.log(obj);
      res.json(obj);
    });
  });

  app.get('/search/repos/:repo/:page/:amountPage', (req, res) => {
    const reqSearch = {
      headers: {
        'User-Agent': 'GitHub-Researcher-API',
      },
      method: 'GET',
      uri: `https://api.github.com/search/repositories?q=${req.params.repo}&page=${req.params.page}&per_page=${req.params.amountPage}`
    }
    request(reqSearch, (err,resp) => {
      let item = JSON.parse(resp.body);
      let itens = item.items
      let obj = {};
      let objs = []
      for(let i=0; i<itens.length; i++){
        obj.id = itens[i].id;
        obj.name = itens[i].full_name;
        obj.userId = itens[i].owner.id;
        obj.description = itens[i].description;
        obj.language = itens[i].language;
        obj.createdAt = itens[i].created_at;
        objs.push(obj);
        obj = {};
      }
      res.json(objs);
    });
  });

  app.post('/commit/:login/:repo/:branch/', (req,res) => {

    let user = req.headers['user'].split(':')[0];
    let pass = req.headers['user'].split(':')[1];
    let content = req.body.content;
    let arqName = req.body.arquivo;
    let commitMsg = req.body.commitmsg;

    const reqUser = {
      headers: {
        'User-Agent': 'GitHub-Researcher-API'
      },
      method: 'GET',
      uri: `https://api.github.com/repos/${req.params.login}/${req.params.repo}/git/refs/heads/${req.params.branch}`
    };

    request(reqUser, (err, resp) => {
      let obj = JSON.parse(resp.body);
      const reqCommit = {
        headers: {
          'User-Agent': 'GitHub-Researcher-API'
        },
        method: 'GET',
        uri: obj.object.url
      }
      request(reqCommit, (err,respCommit) => {
        let commitObj = JSON.parse(respCommit.body);
        let valInfo = {};
        valInfo.sha = commitObj.sha;
        valInfo.tree_sha = commitObj.tree.sha;
        valInfo.tree_url = commitObj.tree.url;
        const reqBlob = {
          headers: {
            'User-Agent': 'GitHub-Researcher-API',
            'Authorization': 'Basic ' + Buffer.from(user + ':' + pass).toString('base64')
          },
          method: 'POST',
          uri: `https://api.github.com/repos/${req.params.login}/${req.params.repo}/git/blobs`,
          body: {
            content: content,
            encoding: 'utf-8'
          },
          json: true
        }
        request(reqBlob, (err,respBlob) => {
          let objBlob = respBlob.body;
          const reqTree = {
            headers: {
              'User-Agent': 'GitHub-Researcher-API'
            },
            method: 'GET',
            uri: valInfo.tree_url
          }
          request(reqTree, (err, respTree) => {
            let objTreeAtual = JSON.parse(respTree.body);
            let reqNewTree = {
              headers: {
                'User-Agent': 'GitHub-Researcher-API',
                'Authorization': 'Basic ' + Buffer.from(user + ':' + pass).toString('base64')
              },
              method: 'POST',
              uri: `https://api.github.com/repos/${req.params.login}/${req.params.repo}/git/trees`,
              body: {
                base_tree: objTreeAtual.sha,
                tree: [
                  {
                    path: arqName,
                    mode: '100644',
                    type: 'blob',
                    sha: objBlob.sha
                  }
                ]
              },
              json: true
            };
            request(reqNewTree, (err, respNewTree) => {
              let objNewTree = respNewTree.body;
              let reqNewCommit = {
                headers: {
                  'User-Agent': 'GitHub-Researcher-API',
                  'Authorization': 'Basic ' + Buffer.from(user + ':' + pass).toString('base64')
                },
                method: 'POST',
                uri: `https://api.github.com/repos/${req.params.login}/${req.params.repo}/git/commits`,
                body: {
                  "message": commitMsg,
                  "parents": [valInfo.sha],
                  "tree": objNewTree.sha
                },
                json: true
              };
              request(reqNewCommit, (err, respNewCommit) => {
                let objNewCommit = respNewCommit.body;
                let reqUpdateHead = {
                  headers: {
                    'User-Agent': 'GitHub-Researcher-API',
                    'Authorization': 'Basic ' + Buffer.from(user + ':' + pass).toString('base64')
                  },
                  method: 'PATCH',
                  uri: `https://api.github.com/repos/${req.params.login}/${req.params.repo}/git/refs/heads/${req.params.branch}`,
                  body: {
                    sha: objNewCommit.sha,
                    force: true
                  },
                  json: true
                };
                request(reqUpdateHead, (err,respUpdateHead) => {
                  let objUpdateHead = respUpdateHead.body;
                  res.json(objUpdateHead);
                });
              });
            });
          });
        });
      });
    });
  });

}

module.exports = appRouter;
