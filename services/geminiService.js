const { VertexAI } = require("@google-cloud/vertexai");

class GeminiService {
    async generateContent(customPrompt, prompt) {
        // Vertex AIの初期化
        const vertexAI = new VertexAI({
            project: process.env.GOOGLE_PROJECT_ID,
            location: "asia-east1",
        });

        // Geminiモデルの取得
        const model = vertexAI.preview.getGenerativeModel({
            model: "gemini-1.5-flash-002",
            systemInstruction: customPrompt,
        });

        // 生成リクエストの実行
        const result = await model.generateContent(prompt);

        const response = result.response.candidates[0].content.parts[0].text;

        try {
            const content = response.substring(
                response.indexOf("{"),
                response.lastIndexOf("}") + 1
            );
            return JSON.parse(content);
        } catch (e) {
            throw new Error(`AIからのレスポンスの解析に失敗しました: ${e}`);
        }
    }
}

module.exports = { GeminiService };
