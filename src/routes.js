import express from 'express';
import AskController from './controllers/ask-controller.js';
import DocumentsController from './controllers/documents-controller.js';
import openAiIntegration from "./integration/openai.js";
import QDrantDatabase from "./integration/qdrant.js"; "./integration/qdrant.js";

const router = express.Router();
const qdrantClient = new QDrantDatabase()
const askController = new AskController(new openAiIntegration().client, qdrantClient);
const documentsController = new DocumentsController(qdrantClient);

router.post('/ask', async (req, res) => await askController.ask(req, res));
router.post('/index', async (req, res) => await documentsController.indexPDFs(req, res));

export default router;