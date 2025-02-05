/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const { VertexAI } = require("@google-cloud/vertexai");
const { log } = require("firebase-functions/logger");
const app = express();

// すべてのオリジンを許可（* を使用）
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Hello, World!")
})

app.get("/ping", (req, res) => {
    res.json({ result: true })
})

app.post("/proxy", async (req, res) => {
    try {
        const url = req.body.url;
        console.log(`Fetching ${url}`);
        const response = await fetch(url);
        const data = await response.json();

        res.set("Access-Control-Allow-Origin", "*"); // これを追加
        res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.set("Access-Control-Allow-Headers", "Content-Type");

        res.json(data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// OPTIONSリクエストの対応（CORS用）
app.options("/proxy", (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
});

app.post("/ask-gemini", async (req, res) => {
    try {
        const { prompt } = req.body;

        // Vertex AIの初期化
        const vertexAI = new VertexAI({
            project: process.env.GOOGLE_PROJECT_ID,
            location: "asia-east1",
        });

        // Geminiモデルの取得
        const model = vertexAI.preview.getGenerativeModel({
            model: "gemini-1.5-flash-002",
        });

        // 生成リクエストの実行
        const result = await model.generateContent(prompt);

        const response = result.response.candidates[0].content.parts[0].text;

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
