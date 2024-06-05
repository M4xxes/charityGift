const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const stripe = require('stripe')('sk_test_51PON9hFFq5gNYQ18hjQ2wCLwO0AcSs1No2KfSIQCEILX4tYRaZLMzZYyVr1C6eEyGecA446qPn7saPIYjXWKC1Yx00TFhVanRO'); // Remplacez par votre clé secrète de test Stripe

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, 'asso_caritatives_lyon.json');

// Vérifiez si le fichier existe et chargez les données
if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
}

let associations;
try {
    const data = fs.readFileSync(filePath, 'utf-8');
    associations = JSON.parse(data);
} catch (error) {
    console.error('Error reading or parsing file:', error);
    process.exit(1);
}

app.get('/api/associations', (req, res) => {
    res.json(associations);
});

app.get('/api/associations/category/:category', (req, res) => {
    const category = req.params.category;
    const filteredAssociations = associations.filter(association => association.category.toLowerCase() === category.toLowerCase());
    res.json(filteredAssociations);
});

app.post('/api/donate', (req, res) => {
    const { associationId, amount } = req.body;
    // Logique pour traiter le don
    res.json({ message: `Donated ${amount} to association ${associationId}` });
});

// Créez une route pour créer un paiement Stripe
app.post('/api/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Montant en centimes
            currency: 'usd',
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Servir les fichiers statiques du répertoire "public"
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
