// Configuration des API
const NEWS_API_KEY = 'TON_API_KEY_NEWSAPI'; // Remplace par ta clé NewsAPI
const CHATGPT_API_KEY = 'TON_API_KEY_CHATGPT'; // Remplace par ta clé ChatGPT

// Éléments DOM
const editorialText = document.getElementById('editorial-text');
const mainArticleTitle = document.getElementById('main-article-title');
const mainArticleImage = document.getElementById('main-article-image');
const mainArticleSummary = document.getElementById('main-article-summary');
const otherArticles = document.querySelector('.other-articles');
const mostReadArticles = document.getElementById('most-read-articles');
const categoryFeed = document.getElementById('category-feed');
const sentimentFeed = document.getElementById('sentiment-feed');
const sourceFeed = document.getElementById('source-feed');
const pollForm1 = document.getElementById('poll-form-1');
const pollForm2 = document.getElementById('poll-form-2');
const pollForm3 = document.getElementById('poll-form-3');

// Récupérer les articles via NewsAPI
async function fetchArticles() {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=Algérie&apiKey=${NEWS_API_KEY}`);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
    }
}

// Analyser et réécrire un titre avec ChatGPT
async function analyzeTitle(title) {
    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHATGPT_API_KEY}`
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: `Réécris ce titre : ${title}`,
                max_tokens: 50
            })
        });
        const data = await response.json();
        return data.choices[0].text.trim();
    } catch (error) {
        console.error('Erreur lors de l\'analyse du titre:', error);
        return title; // Retourne le titre original en cas d'erreur
    }
}

// Afficher les articles sur la page d'accueil
async function displayArticles() {
    const articles = await fetchArticles();
    if (articles && articles.length > 0) {
        // Afficher le premier article en gros
        const mainArticle = articles[0];
        mainArticleTitle.textContent = await analyzeTitle(mainArticle.title);
        mainArticleImage.src = mainArticle.urlToImage;
        mainArticleSummary.textContent = mainArticle.description;

        // Afficher les autres articles
        articles.slice(1, 10).forEach(async (article) => {
            const articleElement = document.createElement('div');
            articleElement.className = 'article';
            articleElement.innerHTML = `
                <h3>${await analyzeTitle(article.title)}</h3>
                <p>${new Date(article.publishedAt).toLocaleDateString()}</p>
                <img src="${article.urlToImage}" alt="${article.title}">
                <p>${article.description}</p>
                <a href="/article-analysis.html?id=${article.url}" target="_blank">Lire l'analyse</a>
            `;
            otherArticles.appendChild(articleElement);
        });

        // Afficher les articles les plus lus
        articles.slice(0, 9).forEach(async (article) => {
            const articleElement = document.createElement('div');
            articleElement.className = 'article';
            articleElement.innerHTML = `
                <h3>${await analyzeTitle(article.title)}</h3>
                <p>${new Date(article.publishedAt).toLocaleDateString()}</p>
            `;
            mostReadArticles.appendChild(articleElement);
        });
    }
}

// Gérer les sondages
pollForm1.addEventListener('submit', (event) => {
    event.preventDefault();
    const answer = document.getElementById('poll-question-1').value;
    alert(`Merci pour votre réponse : ${answer}`);
});

pollForm2.addEventListener('submit', (event) => {
    event.preventDefault();
    const answer = document.getElementById('poll-question-2').value;
    alert(`Merci pour votre réponse : ${answer}`);
});

pollForm3.addEventListener('submit', (event) => {
    event.preventDefault();
    const answer = document.getElementById('poll-question-3').value;
    alert(`Merci pour votre réponse : ${answer}`);
});

// Charger l'éditorial basé sur les articles du jour
async function loadEditorial() {
    const articles = await fetchArticles();
    if (articles && articles.length > 0) {
        const editorialPrompt = `Résume la tonalité des articles suivants en 100 mots : ${articles.map(a => a.title).join(', ')}`;
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHATGPT_API_KEY}`
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: editorialPrompt,
                max_tokens: 100
            })
        });
        const data = await response.json();
        editorialText.textContent = data.choices[0].text.trim();
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    displayArticles();
    loadEditorial();
});
