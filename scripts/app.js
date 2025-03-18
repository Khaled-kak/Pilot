fetch('https://newsapi.org/v2/everything?q=Algérie&apiKey=fce4d310a188453eaa6c3118531b7226')
    .then(response => response.json())
    .then(data => {
        const articles = data.articles;
        // Traiter les articles et les afficher
    });
