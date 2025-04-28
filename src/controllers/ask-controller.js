class AskController {
    constructor(openAiIntegration, qdrantClient) {
        this.chat = openAiIntegration
        this.qdrantClient = qdrantClient;
    }

    async ask(req, res) {
        const {question} = req.body;
        try {
            const relevantDocs = await this.qdrantClient.getAllDocuments(question)
            const context = relevantDocs.map(doc => doc.pageContent).join('\n');
            const response = await this.chat.invoke([
                {
                    role: 'system',
                    content: 'Responda com base no contexto fornecido. Mas sem falar que essa informação e do contexto.'
                },
                {role: 'user', content: `Contexto: ${context}\n\nPergunta: ${question}`}
            ]);

            return res.json({answer: response.content});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: 'Erro ao responder à pergunta'});
        }
    }
}

export default AskController;