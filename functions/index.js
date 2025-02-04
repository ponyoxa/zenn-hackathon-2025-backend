/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();

// すべてのオリジンを許可（* を使用）
app.use(cors({ origin: true }));

app.post("/proxy", async (req, res) => {
    try {
        const url = req.body.url;
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

exports.api = functions.https.onRequest(app);