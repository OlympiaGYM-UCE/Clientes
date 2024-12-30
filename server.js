const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/pdistribuida', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error(err));

// Esquema y modelo de Cliente
const clienteSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    cedula: { type: String, unique: true },
    fechaNacimiento: Date,
    peso: Number,
    estatura: Number,
    genero: String,
});

const Cliente = mongoose.model('Cliente', clienteSchema,'clientes');

// Rutas

// Crear cliente
app.post('/clientes', async (req, res) => {
    try {
        const cliente = new Cliente(req.body);
        await cliente.save();
        res.status(201).send(cliente);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Listar todos los clientes
app.get('/clientes', async (req, res) => {
    try {
        const clientes = await Cliente.find(); // Obtiene todos los documentos de la colección
        res.send(clientes); // Devuelve la lista de clientes
    } catch (error) {
        res.status(500).send(error); // Manejo de errores
    }
});

// Obtener cliente por cédula
app.get('/clientes/:cedula', async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ cedula: req.params.cedula });
        if (!cliente) return res.status(404).send('Cliente no encontrado');
        res.send(cliente);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Actualizar cliente
app.put('/clientes/:cedula', async (req, res) => {
    try {
        const cliente = await Cliente.findOneAndUpdate(
            { cedula: req.params.cedula },
            req.body,
            { new: true }
        );
        if (!cliente) return res.status(404).send('Cliente no encontrado');
        res.send(cliente);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Eliminar cliente
app.delete('/clientes/:cedula', async (req, res) => {
    try {
        const cliente = await Cliente.findOneAndDelete({ cedula: req.params.cedula });
        if (!cliente) return res.status(404).send('Cliente no encontrado');
        res.send(cliente);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Iniciar el servidor esto talvez no usaremos en AWS....
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
