class ZennService {
    async fetchArticles(zennAccount) {
        // Zennの投稿一覧を取得
        const articleList = await this.fetchPosts(zennAccount);

        // 投稿一覧から投稿を取得
        let articleText = "";
        for (const articleId of articleList) {
            const article = await this.fetchArticle(articleId);
            articleText += article;
        }

        return articleText;
    }

    async fetchPosts(zennAccount) {
        const apiArticlesUrl = `https://zenn.dev/api/articles?page=1&username=${zennAccount}&count=96&order=latest`;
        const response = await fetch(apiArticlesUrl);
        const responseBody = await response.json();
        const articleList = responseBody["articles"];

        return articleList.map((article) => article.slug.toString());
    }

    async fetchArticle(articleId) {
        const apiArticleUrl = `https://zenn.dev/api/articles/${articleId}`;
        const response = await fetch(apiArticleUrl);
        if (response.status !== 200) {
            return "";
        }

        const responseBody = await response.json();
        const article = responseBody["article"];
        const bodyHtml = article["body_html"] || "";
        const plainText = this.removeHtmlTags(bodyHtml);

        return plainText;
    }

    removeHtmlTags(html) {
        const exp = new RegExp("<[^>]*>", "gmi");
        return html.replaceAll(exp, "");
    }
}

module.exports = { ZennService };
