//Espress - Backend
var express = require('express')
var app = express()
var sqlite3 = require('sqlite3').verbose()


app.set('view engine', 'ejs')
app.use( express.static( "Img" ) );

app.get('/home', function(req, res) {  
  res.render("inicio");  
  console.log("Pantalla de inicio")
})

app.get('/', function(req, res) {  
  res.render("inicio");  
  console.log("Pantalla de inicio")
})

app.get('/add', function(req, res) {  
  res.render("add");  
  console.log("Pantalla de inicio")
})

app.get('/delete', function(req, res) {  
  res.render("borrar");  
  console.log("Pantalla de inicio")
})

app.get('/update', function(req, res) {  
  res.render("update");  
  console.log("Pantalla de inicio")
})

app.get('/mostrar', function(req, res) {

  var db = new sqlite3.Database("data.sqlite3")
  
  var _contactos = [];

  db.all("SELECT * FROM contactos;", function(err, rows)
  {  
    rows.forEach(function (row) {  
     _contactos.push([row.numero, row.nombre])

    })
    res.render("viewall",{contactos:_contactos});
      //res.json({"data":_contactos})

  });
 
  db.close();
  console.log("Mostrando contactos")
})

app.get('/guardar', function(req, res) {

  var db = new sqlite3.Database("data.sqlite3")

  var stmt = db.prepare("INSERT INTO contactos VALUES (?,?)")
  stmt.run(req.query.telefono,req.query.nombre)
  stmt.finalize();
  console.log("Contacto: " + req.query.nombre + " guardado con el numero de telefono: " + req.query.telefono);    
    
  db.close();

  res.redirect('mostrar');  
  
})

app.get('/borrar', function(req, res) {

  var db = new sqlite3.Database("data.sqlite3")
  
  db.serialize(function() {
    var stmt = db.prepare("DELETE FROM contactos WHERE numero = 9999")
    stmt.run()
    stmt.finalize();
    console.log("Contacto: " + req.query.nombre + " borrado");
  });
  db.close();
  res.redirect('mostrar');
})


app.get('/actualizar', function(req, res) {

  var db = new sqlite3.Database("data.sqlite3")
  
  db.serialize(function() {
    var stmt = db.prepare("UPDATE contactos SET nombre = ? WHERE numero = ?")
    stmt.run(req.query.nombre,req.query.telefono)
    stmt.finalize();
    console.log("Contacto: " + req.query.nombre + " actualizado");
  });
  db.close();
  res.redirect('mostrar');
})


app.get('/buscar', function(req, res) {

  //console.log("Parametro recibido" + req.query.telefono);	

  var db = new sqlite3.Database("data.sqlite3")
  
  var _contactos = [];
  
  db.all("SELECT * FROM contactos WHERE numero = ?", req.query.telefono,function(err, rows)
  {  
    rows.forEach(function (row) {  
     _contactos.push([row.numero, row.nombre])     

    })
    res.render("info",{contactos:_contactos});
      //res.json({"data":_contactos})

  });
 
  db.close();
  console.log("Mostrando contactos para actualizar")
})

console.log("Servicios iniciados")
app.listen(8001)
