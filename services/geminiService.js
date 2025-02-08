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
        let resultJson = "";

        for (let i = 0; i < 3; i++) {
            const result = await model.generateContent(prompt);

            const response =
                result.response.candidates[0].content.parts[0].text;

            try {
                const content = response.substring(
                    response.indexOf("{"),
                    response.lastIndexOf("}") + 1
                );
                resultJson = JSON.parse(content);
            } catch (e) {
                continue;
            }
            if (resultJson) {
                resultJson.level_metrics = resultJson.level_metrics.filter(
                    (metric) =>
                        !metric.label.includes("テックスキル") &&
                        !metric.label.includes("継続性") &&
                        !metric.label.includes("課題解決") &&
                        !metric.label.includes("コミュニケーション") &&
                        !metric.label.includes("独自性") &&
                        !metric.label.includes("問題解決")
                );
                return resultJson;
            }
        }
        throw new Error("AIからのレスポンスの解析に失敗しました");

    }
}

module.exports = { GeminiService };
