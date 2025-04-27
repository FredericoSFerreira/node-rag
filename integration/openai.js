import {ChatOpenAI} from "@langchain/openai";

export function openAiIntegration() {
    return new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: 'gpt-3.5-turbo',
        temperature: 0.3 //Nível de criatividade e aleatoriedade
    });
}
