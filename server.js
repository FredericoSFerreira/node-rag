import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter';
import {extractTextFromPDF} from "./utils/utils.js";
import {openAiIntegration} from "./integration/openai.js";
import {getQdrantClient, createCollection, insertDocuments, getAllDocuments} from "./integration/qdrant.js";

const app = express();
app.use(cors());
app.use(express.json());

const chat = openAiIntegration()
const qdrantClient = getQdrantClient()


async function indexPDFs() {
    await createCollection(qdrantClient);
    const files = fs.readdirSync('./docs').filter(file => file.endsWith('.pdf'));
    let documents = [];

    for (const file of files) {
        const content = await extractTextFromPDF(path.join('./docs', file));
        documents.push({pageContent: content, metadata: {source: file}});
    }

    const splitter = new RecursiveCharacterTextSplitter({chunkSize: 500, chunkOverlap: 50});
    const chunks = await splitter.splitDocuments(documents);

    await insertDocuments(qdrantClient, chunks);
}


app.post('/index', async (req, res) => {
    try {
        await indexPDFs();
        res.json({message: 'PDFs indexados com sucesso!'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Erro ao indexar PDFs'});
    }
});


app.post('/ask', async (req, res) => {
    const {question} = req.body;
    try {
        const relevantDocs = await getAllDocuments(qdrantClient, question)
        const context = relevantDocs.map(doc => doc.pageContent).join('\n');
        const response = await chat.invoke([
            {
                role: 'system',
                content: 'Responda com base no contexto fornecido. Mas sem falar que essa informação e do contexto.'
            },
            {role: 'user', content: `Contexto: ${context}\n\nPergunta: ${question}`}
        ]);

        res.json({answer: response.content});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Erro ao responder à pergunta'});
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
