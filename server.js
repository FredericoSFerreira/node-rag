import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './src/routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes)

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
