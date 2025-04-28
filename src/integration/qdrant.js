import {QdrantClient} from "@qdrant/js-client-rest";
import {QdrantVectorStore} from "@langchain/qdrant";
import {OpenAIEmbeddings} from "@langchain/openai";

class QDrantDatabase {

    constructor(client) {
        this.collection_name = 'pdf_documents'
        this.qdrantClient = new QdrantClient({
            url: process.env.QDRANT_DATABASE_URL,
            apiKey: process.env.QDRANT_DATABASE_KEY,
        });
    }

    async createCollection() {
        const collectionExists = await this.qdrantClient.getCollection(this.collection_name).catch(() => null);

        if (!collectionExists) {
            await this.qdrantClient.createCollection(this.collection_name, {
                vectors: {size: 1536, distance: 'Cosine'},
            });
            console.log(`Coleção ${this.collection_name} criada!`);
        }
    }


    async insertDocuments(chunks) {
        return await QdrantVectorStore.fromDocuments(chunks, new OpenAIEmbeddings(), {
            client: this.qdrantClient,
            collectionName: this.collection_name,
        });
    }

    async getAllDocuments(question) {
        const vectorStore = await QdrantVectorStore.fromExistingCollection(
            new OpenAIEmbeddings(),
            {
                client: this.qdrantClient,
                collectionName: this.collection_name,
            }
        );
        const retriever = vectorStore.asRetriever();
        return await retriever.getRelevantDocuments(question);
    }
}


export default QDrantDatabase;
