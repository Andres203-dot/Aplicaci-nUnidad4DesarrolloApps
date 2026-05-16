const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/gestion', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Modelo de Actividad
const Actividad = mongoose.model('Actividad', {
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true }
});

// GET - obtener todas las actividades
app.get('/actividades', async (req, res) => {
  const actividades = await Actividad.find();
  res.json(actividades);
});

// POST - crear nueva actividad
app.post('/actividades', async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre || !descripcion) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }
  const nuevaActividad = new Actividad({ nombre, descripcion });
  await nuevaActividad.save();
  res.status(201).json(nuevaActividad);
});

// PUT - actualizar actividad por id
app.put('/actividades/:id', async (req, res) => {
  try {
    const actividadActualizada = await Actividad.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (actividadActualizada) {
      res.json(actividadActualizada);
    } else {
      res.status(404).json({ mensaje: "Actividad no encontrada" });
    }
  } catch (error) {
    res.status(400).json({ mensaje: "Error en la actualización" });
  }
});

// DELETE - eliminar actividad por id
app.delete('/actividades/:id', async (req, res) => {
  try {
    const actividadEliminada = await Actividad.findByIdAndDelete(req.params.id);
    if (actividadEliminada) {
      res.json({ mensaje: "Actividad eliminada correctamente" });
    } else {
      res.status(404).json({ mensaje: "Actividad no encontrada" });
    }
  } catch (error) {
    res.status(400).json({ mensaje: "Error al eliminar" });
  }
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
// GET - Obtener todas las actividades
fetch('http://localhost:3000/actividades')
  .then(res => res.json())
  .then(data => {
    console.log("Actividades:", data);
  })
  .catch(error => {
    console.error("Error al obtener actividades:", error);
  });


// POST - Crear una nueva actividad
fetch('http://localhost:3000/actividades', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre: "Seguimiento",
    descripcion: "Control de avances"
  })
})
.then(res => res.json())
.then(data => {
  console.log("Actividad creada:", data);
})
.catch(error => {
  console.error("Error al crear actividad:", error);
});

// PUT - Actualizar una actividad
fetch('http://localhost:3000/actividades/ID_DE_LA_ACTIVIDAD', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre: "Planificación actualizada",
    descripcion: "Nueva descripción"
  })
})
.then(res => res.json())
.then(data => {
  console.log("Actividad actualizada:", data);
})
.catch(error => {
  console.error("Error al actualizar actividad:", error);
});

// DELETE - Eliminar una actividad
fetch('http://localhost:3000/actividades/ID_DE_LA_ACTIVIDAD', {
  method: 'DELETE'
})
.then(res => res.json())
.then(data => {
  console.log(data.mensaje);
})
.catch(error => {
  console.error("Error al eliminar actividad:", error);
});
