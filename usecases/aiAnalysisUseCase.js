const { ZennService } = require("../services/zennService");
const { PromptService } = require("../services/promptService");
const { GeminiService } = require("../services/geminiService");

class AiAnalysisUseCase {
    async generateContent(desiredLevel, futureImage, zennAccount) {
        const zennService = new ZennService();
        const promptService = new PromptService();
        const geminiService = new GeminiService();

        const zennArticles = await zennService.fetchArticles(zennAccount);

        const prompt = promptService.generatePrompt(
            desiredLevel,
            futureImage,
            zennArticles
        );

        const response = await geminiService.generateContent(prompt);

        return response;
    }
}

module.exports = { AiAnalysisUseCase };
