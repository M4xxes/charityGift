const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Servir les fichiers statiques depuis le répertoire public
app.use(express.static(path.join(__dirname)));

// Charger les données des associations
const filePath = path.join(__dirname, 'asso_caritatives.json');
if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
}
const associations = JSON.parse(fs.readFileSync(filePath, 'utf8'));

app.get('/api/associations', (req, res) => {
    res.json(associations);
});

app.post('/api/donate', (req, res) => {
    const { associationId, amount } = req.body;
    console.log(`Received donation of ${amount} for association ${associationId}`);
    res.json({ message: `Thank you for donating ${amount} to association ${associationId}` });
});

// Servir la page HTML pour la route racine
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
