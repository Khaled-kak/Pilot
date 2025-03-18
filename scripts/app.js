fetch('https://newsapi.org/v2/everything?q=Algérie&apiKey=TON_API_KEY')
    .then(response => response.json())
    .then(data => {
        const articles = data.articles;
        // Traiter les articles et les afficher
    });
