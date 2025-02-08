const { ZennService } = require("../services/zennService");
const { PromptService } = require("../services/promptService");
const { GeminiService } = require("../services/geminiService");

class AiAnalysisUseCase {
    async generateContent(desiredLevel, futureImage, zennAccount) {
        const zennService = new ZennService();
        const promptService = new PromptService();
        const geminiService = new GeminiService();

        const zennArticles = await zennService.fetchArticles(zennAccount);

        const customPrompt = promptService.getCustomPrompt();

        const prompt = promptService.generatePrompt(
            desiredLevel,
            futureImage,
            zennAccount,
            zennArticles
        );

        const response = await geminiService.generateContent(
            customPrompt,
            prompt
        );

        return response;
    }
}

module.exports = { AiAnalysisUseCase };
