
# Node RAG

Servidor Node.js para **Retrieval-Augmented Generation (RAG)** utilizando **LangChain** e **Qdrant**.

## ✨ Funcionalidades

- Processamento de arquivos PDF
- Armazenamento vetorial com Qdrant
- Integração com modelos de linguagem (LLMs) da OpenIA via LangChain
- API REST simples com Express.js

## 📦 Tecnologias

- Node.js
- Express
- LangChain
- Qdrant
- dotenv
- pdf-text-reader

## 🚀 Instalação

```bash
git clone https://github.com/FredericoSFerreira/node-rag.git
cd node-rag
npm install
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz com suas variáveis de ambiente, por exemplo:

```env
OPENAI_API_KEY=your-openai-api-key
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-qdrant-api-key for qdrant cloud ou empty
```

## 🏃‍♂️ Como rodar

```bash
docker-compose up 
npm start
```

O servidor será iniciado localmente.


## 📂 Pasta de documentos

- **docs/**: Pasta onde os arquivos PDF podem ser adicionados para serem processados e indexados.


## 🔧 Endpoints

### **1. /index**

**Método**: `POST`

**Descrição**: Esse endpoint permite adicionar documentos ao Qdrant, criando vetores que podem ser utilizados para consultas no futuro.

**Exemplo de Requisição**:

```json
{
  "text": "Texto do documento ou conteúdo a ser indexado"
}
```

**Resposta**:

```json
{
  "message": "Documento indexado com sucesso",
  "status": "success"
}
```

---

### **2. /ask**

**Método**: `POST`

**Descrição**: Esse endpoint permite consultar os vetores já indexados no Qdrant e obter respostas baseadas nos dados armazenados.

**Exemplo de Requisição**:

```json
{
  "query": "Qual é a capital do Brasil?"
}
```

**Resposta**:

```json
{
  "answer": "A capital do Brasil é Brasília.",
  "status": "success"
}
```

---


## 📜 Licença

Este projeto está licenciado sob a licença [MIT](LICENSE).
