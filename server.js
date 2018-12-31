var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

app.use(function(req, res, next){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.listen(9090, function(){ console.log('Servidor Web rodando na porta 9090') });

app.get('/api', function(req, res){
  fs.readFile('usuarios.json', 'utf8', function(err, data){
    if (err) {
      var response = {status: 'falha', resultado: err};
      res.json(response);
    } else {
      var obj = JSON.parse(data);
      var result = 'Nenhum usuário foi encontrado';

      obj.usuarios.forEach(function(usuario) {
        if (usuario != null) {
          if (usuario.usuario_id == req.query.usuario_id) {
            result = usuario;
          }
        }
      });

      var response = {status: 'sucesso', resultado: result};
      res.json(response);
    }
  });
});

app.post('/api', function(req, res){
  fs.readFile('usuarios.json', 'utf8', function(err, data){
    if (err) {
      var response = {status: 'falha', resultado: err};
      res.json(response);
    } else {
      var obj = JSON.parse(data);
      req.body.usuario_id = obj.usuarios.length + 1;

      obj.usuarios.push(req.body);

      fs.writeFile('usuarios.json', JSON.stringify(obj), function(err) {
        if (err) {
          var response = {status: 'falha', resultado: err};
          res.json(response);
        } else {
          var response = {status: 'sucesso', resultado: 'Registro incluso com sucesso'};
          res.json(response);
        }
      });
    }
  });
});

app.put('/api', function(req, res){
  fs.readFile('usuarios.json', 'utf8', function(err, data){
    if (err) {
      var response = {status: 'falha', resultado: err};
      res.json(response);
    } else {
      var obj = JSON.parse(data);

      obj.usuarios[(req.body.usuario_id - 1)].nome = req.body.nome;
      obj.usuarios[(req.body.usuario_id - 1)].site = req.body.site;

      fs.writeFile('usuarios.json', JSON.stringify(obj), function(err) {
        if (err) {
          var response = {status: 'falha', resultado: err};
          res.json(response);
        } else {
          var response = {status: 'sucesso', resultado: 'Registro editado com sucesso'};
          res.json(response);
        }
      });
    }
  });
});

