/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { AiAnalysisUseCase } = require("./usecases/aiAnalysisUseCase");

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const { VertexAI } = require("@google-cloud/vertexai");
const { log } = require("firebase-functions/logger");
const app = express();

// すべてのオリジンを許可（* を使用）
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.get("/ping", (req, res) => {
    res.json({ result: true });
});

app.post("/ask-gemini", async (req, res) => {
    try {
        const { desiredLevel, futureImage, zennAccount } = req.body;
        const aiAnalysisUseCase = new AiAnalysisUseCase();
        const response = await aiAnalysisUseCase.generateContent(
            desiredLevel,
            futureImage,
            zennAccount
        );

        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.set("Access-Control-Allow-Headers", "Content-Type");

        res.json(response);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
    console.log(`helloworld: listening on port ${port}`);
});
