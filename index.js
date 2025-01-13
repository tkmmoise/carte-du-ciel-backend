const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');

const { parseStar, formatStar } = require('./helper/formatter');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
}));


// Charger les données du fichier CSV
let stars = [];
let visibleStars = [];
let closestStars = [];
let brightestStars = [];
let hottestStars = [];
let largestStars = [];

function loadCsvData() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream('./data/stars-v2.csv') 
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        stars = results.map((star) => (formatStar(parseStar(star))));

        // Calculer les étoiles visibles à l’œil nu
        visibleStars = stars.filter((star) => star.mag < 6.5);

        // Calculer les 50 étoiles les plus proches visibles à l’œil nu
        closestStars = visibleStars.toSorted((a, b) => a.dist - b.dist).slice(0, 50);

        // Calculer les 50 étoiles les plus brillantes
        brightestStars = stars.toSorted((a, b) => a.mag - b.mag).slice(0, 50);

        // Calculer les 50 étoiles les plus chaudes
        hottestStars = stars.toSorted((a, b) => a.ci - b.ci).slice(0, 50);

        // Calculer les 50 étoiles les plus grosses
        largestStars = stars.toSorted((a, b) => b.lum - a.lum).slice(0, 50);

        resolve();
      })
      .on('error', reject);
  });
}

// Endpoint : Toutes les étoiles
app.get('/api/stars', (req, res) => {
  res.json(stars);
});

// Endpoint : Toutes les étoiles filtrées en une seule réponse
app.get('/api/stars/filters', (req, res) => {
  res.json({ closestStars, brightestStars, hottestStars, largestStars });
});


// Endpoint : 50 étoiles les plus proches visibles à l’œil nu
app.get('/api/stars/closest', (req, res) => {
  res.json(closestStars);
});

// Endpoint : 50 étoiles les plus brillantes
app.get('/api/stars/brightest', (req, res) => {
  res.json(brightestStars);
});

// Endpoint : 50 étoiles les plus chaudes
app.get('/api/stars/hottest', (req, res) => {
  res.json(hottestStars);
});

// Endpoint : 50 étoiles les plus grosses
app.get('/api/stars/largest', (req, res) => {
  res.json(largestStars);
});

// Lancer le serveur
(async () => {
  await loadCsvData(); // Charger les données avant de démarrer le serveur
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
})();