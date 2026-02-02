import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Railway inyecta el puerto automáticamente a través de la variable de entorno PORT
// Usamos 3000 como fallback estándar para coincidir con backend y evitar conflictos de proxy
const port = process.env.PORT || 3000;

// Servir los archivos estáticos generados por el build (carpeta 'dist')
app.use(express.static(path.join(__dirname, 'dist')));

// Endpoint de salud requerido por Railway (definido en railway.toml)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Manejar cualquier otra ruta devolviendo index.html (para SPA/React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Health check endpoint available at /health`);
  console.log(`Serving static files from ${path.join(__dirname, 'dist')}`);
});