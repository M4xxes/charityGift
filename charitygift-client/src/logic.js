const associations = [
    { id: 1, name: 'Environnement', type: 'environnement' },
    { id: 2, name: 'Santé', type: 'santé' },
    { id: 3, name: 'Éducation', type: 'éducation' },
    // Ajoutez d'autres associations ici
];

// Recherche et filtrage par type de cause
function filterAssociationsByType(type) {
    return associations.filter(association => association.type === type);
}

// Don personnalisé
function personalizedDonation(amount, options = {}) {
    const { minimum = 5, recurring = false, distributeEqually = false, random = false } = options;

    if (amount < minimum) {
        throw new Error(`Le montant minimum pour un don est de ${minimum} euros.`);
    }

    let selectedAssociations;

    if (random) {
        selectedAssociations = [associations[Math.floor(Math.random() * associations.length)]];
    } else if (distributeEqually) {
        selectedAssociations = associations;
    } else {
        selectedAssociations = options.selectedAssociations || [];
    }

    const donationResult = selectedAssociations.map(association => ({
        association: association.name,
        amount: distributeEqually ? (amount / selectedAssociations.length).toFixed(2) : amount
    }));

    return {
        amount,
        recurring,
        donations: donationResult
    };
}