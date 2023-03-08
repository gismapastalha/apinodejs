var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var app = express();

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.use(express.json());
app.use(cors());
//Establecemos los prámetros de conexión
var conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'articulosdb'
});
//Conexión a la database
conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log("¡Conexión exitosa a la base de datos!");
    }
});
app.get('/', function(req,res){
    res.send('Ruta INICIO');
});
//Mostrar todos los artículos
app.get('/api/articulos', (req,res)=>{
    conexion.query('SELECT * FROM articulos', (error,filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    });
});

//Mostrar todos los artículos
app.get('/api/articulos/:id', (req,res)=>{
    conexion.query('SELECT * FROM articulos WHERE id = ?',[req.params.id], (error,fila)=>{
        if(error){
            throw error;
        }else{
            res.send(fila);
        }
    });
});

app.post('/api/articulos', (req,res)=>{
    let data = {descripcion:req.body.descripcion, precio:req.body.precio, stock:req.body.stock};
    let sql = "INSERT INTO articulos SET ?";
    conexion.query(sql, data, function(error,results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});

app.put('/api/articulos/:id', (req,res)=>{
    let id =req.params.id;
    let descripcion = req.body.descripcion;
    let precio = req.body.precio;
    let stock = req.body.stock;
    let sql = "UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?";
    conexion.query(sql, [descripcion, precio, stock, id], function(error,results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});

app.delete('/api/articulos/:id', (req,res)=>{
    conexion.query('DELETE FROM articulos WHERE id = ?',[req.params.id], (error,filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    });
});


const puerto = process.env.PUERTO || 3000;
app.listen(puerto, function(){
    console.log("Servidor Ok en puerto:"+puerto);
});