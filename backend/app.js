const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // ✅ importa cors
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const scanRoutes = require('./routes/scanRoutes');
const medidorRoutes = require('./routes/medidorRoutes');

dotenv.config();
const app = express();

// ✅ Agrega el middleware CORS antes de definir las rutas
const allowedOrigins = [
  'http://localhost:5173',
  'http://74.208.44.21:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/medidores', medidorRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
