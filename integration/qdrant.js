import {QdrantClient} from "@qdrant/js-client-rest";
import {QdrantVectorStore} from "@langchain/qdrant";
import {OpenAIEmbeddings} from "@langchain/openai";

const COLLECTION_NAME = 'pdf_documents';

export function getQdrantClient() {
    return new QdrantClient({
        url: process.env.QDRANT_DATABASE_URL,
        apiKey: process.env.QDRANT_DATABASE_KEY,
    });
}

export async function createCollection(qdrantClient) {
    const collectionExists = await qdrantClient.getCollection(COLLECTION_NAME).catch(() => null);

    if (!collectionExists) {
        await qdrantClient.createCollection(COLLECTION_NAME, {
            vectors: {size: 1536, distance: 'Cosine'},
        });
        console.log(`Coleção ${COLLECTION_NAME} criada!`);
    }
}

export async function insertDocuments(qdrantClient, chunks) {
    return await QdrantVectorStore.fromDocuments(chunks, new OpenAIEmbeddings(), {
        client: qdrantClient,
        collectionName: COLLECTION_NAME,
    });
}

export async function getAllDocuments(qdrantClient, question) {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        new OpenAIEmbeddings(),
        {
            client: qdrantClient,
            collectionName: COLLECTION_NAME,
        }
    );
    const retriever = vectorStore.asRetriever();
    return await retriever.getRelevantDocuments(question);
}