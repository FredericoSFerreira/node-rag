import fs from "node:fs";
import {extractTextFromPDF} from "../utils/utils.js";
import path from "node:path";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";

class DocumentsController {
    constructor(qdrantClient) {
        this.qdrantClient = qdrantClient
    }

    async indexPDFs(req, res) {
        try {
            await this.qdrantClient.createCollection();
            const files = fs.readdirSync('./docs').filter(file => file.endsWith('.pdf'));
            let documents = [];

            for (const file of files) {
                const content = await extractTextFromPDF(path.join('./docs', file));
                documents.push({pageContent: content, metadata: {source: file}});
            }

            const splitter = new RecursiveCharacterTextSplitter({chunkSize: 500, chunkOverlap: 50});
            const chunks = await splitter.splitDocuments(documents);

            await this.qdrantClient.insertDocuments(chunks);
            return res.json({message: 'PDFs indexados com sucesso!'});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: 'Erro ao indexar PDFs'});
        }
    }
}


export default DocumentsController;