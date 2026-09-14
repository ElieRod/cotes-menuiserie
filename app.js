// Import des schémas
const schémas = getSchemas();

// Récupérer les éléments du DOM
const form = document.getElementById('cotationForm');
const previewBtn = document.getElementById('previewBtn');
const generateBtn = document.getElementById('generateBtn');
const previewDiv = document.getElementById('preview');
const previewContent = document.getElementById('previewContent');
const closePreviewBtn = document.getElementById('closePreview');

// Afficher l'aperçu
previewBtn.addEventListener('click', () => {
    const formData = getFormData();
    
    if (!validateForm(formData)) {
        alert('⚠️ Veuillez remplir tous les champs obligatoires !');
        return;
    }

    previewContent.innerHTML = generatePreviewHTML(formData);
    previewDiv.classList.remove('preview-hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Fermer l'aperçu
closePreviewBtn.addEventListener('click', () => {
    previewDiv.classList.add('preview-hidden');
});

// Générer le PDF
generateBtn.addEventListener('click', () => {
    const formData = getFormData();
    
    if (!validateForm(formData)) {
        alert('⚠️ Veuillez remplir tous les champs obligatoires !');
        return;
    }

    generatePDF(formData);
});

// Récupérer les données du formulaire
function getFormData() {
    return {
        clientName: document.getElementById('clientName').value,
        clientEmail: document.getElementById('clientEmail').value,
        clientPhone: document.getElementById('clientPhone').value,
        clientAddress: document.getElementById('clientAddress').value,
        menuiserieType: document.getElementById('menuiserieType').value,
        typeDepose: document.getElementById('typeDepose').value,
        largeur: document.getElementById('largeur').value,
        hauteur: document.getElementById('hauteur').value,
        materiau: document.getElementById('materiau').value,
        vitrage: document.getElementById('vitrage').value,
        couleur: document.getElementById('couleur').value,
        observation: document.getElementById('observation').value,
        prixUnitaire: parseFloat(document.getElementById('prixUnitaire').value) || 0,
        quantite: parseInt(document.getElementById('quantite').value) || 1,
        remise: parseFloat(document.getElementById('remise').value) || 0,
        delai: document.getElementById('delai').value,
        dateEdition: new Date().toLocaleDateString('fr-FR'),
        dateValidite: new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('fr-FR')
    };
}

// Valider le formulaire
function validateForm(data) {
    return data.clientName && 
           data.menuiserieType && 
           data.typeDepose &&
           data.largeur && 
           data.hauteur && 
           data.materiau && 
           data.vitrage && 
           data.prixUnitaire > 0;
}

// Générer l'aperçu HTML
function generatePreviewHTML(data) {
    const schema = schémas[data.menuiserieType] || schémas['autre'];
    const prixTotal = (data.prixUnitaire * data.quantite) * (1 - data.remise / 100);

    return `
        <div class="report">
            <header class="report-header">
                <h2>Devis de Cotation Menuiserie</h2>
                <p><strong>Date d'édition :</strong> ${data.dateEdition}</p>
                <p><strong>Validité :</strong> jusqu'au ${data.dateValidite}</p>
            </header>

            <section class="section">
                <h3>👤 Client</h3>
                <p><strong>Nom :</strong> ${data.clientName}</p>
                <p><strong>Email :</strong> ${data.clientEmail}</p>
                <p><strong>Téléphone :</strong> ${data.clientPhone || 'N/A'}</p>
                <p><strong>Adresse :</strong> ${data.clientAddress || 'N/A'}</p>
            </section>

            <section class="section">
                <h3>📋 Spécifications</h3>
                <p><strong>Type de menuiserie :</strong> ${getLabel(data.menuiserieType)}</p>
                <p><strong>Type de pose :</strong> ${getLabel(data.typeDepose)}</p>
                <p><strong>Dimensions :</strong> ${data.largeur} mm × ${data.hauteur} mm</p>
                <p><strong>Matériau :</strong> ${getLabel(data.materiau)}</p>
                <p><strong>Vitrage :</strong> ${getLabel(data.vitrage)}</p>
                <p><strong>Couleur :</strong> ${data.couleur || 'N/A'}</p>
                ${data.observation ? `<p><strong>Observations :</strong> ${data.observation}</p>` : ''}
            </section>

            <section class="section">
                <h3>🖼️ Schéma</h3>
                <div class="schema-container">
                    ${schema}
                </div>
            </section>

            <section class="section">
                <h3>💰 Tarification</h3>
                <table class="tarif-table">
                    <tr>
                        <td><strong>Prix unitaire</strong></td>
                        <td>${data.prixUnitaire.toFixed(2)} €</td>
                    </tr>
                    <tr>
                        <td><strong>Quantité</strong></td>
                        <td>${data.quantite}</td>
                    </tr>
                    <tr>
                        <td><strong>Sous-total</strong></td>
                        <td>${(data.prixUnitaire * data.quantite).toFixed(2)} €</td>
                    </tr>
                    ${data.remise > 0 ? `
                    <tr class="remise">
                        <td><strong>Remise (${data.remise}%)</strong></td>
                        <td>-${((data.prixUnitaire * data.quantite * data.remise) / 100).toFixed(2)} €</td>
                    </tr>
                    ` : ''}
                    <tr class="total">
                        <td><strong>TOTAL TTC</strong></td>
                        <td><strong>${prixTotal.toFixed(2)} €</strong></td>
                    </tr>
                </table>
                <p><strong>Délai de livraison :</strong> ${data.delai} jours</p>
            </section>

            <footer class="report-footer">
                <p>Devis établi le ${data.dateEdition} - Merci de votre confiance !</p>
            </footer>
        </div>
    `;
}

// Obtenir le label depuis la valeur
function getLabel(value) {
    const labels = {
        'fenetre-1-vantail': 'Fenêtre 1 vantail',
        'fenetre-2-vantaux': 'Fenêtre 2 vantaux',
        'porte-1-vantail': 'Porte 1 vantail',
        'porte-2-vantaux': 'Porte 2 vantaux',
        'coulissant': 'Coulissant',
        'oscillo-battant': 'Oscillo-battant',
        'chassis-fixe': 'Châssis fixe',
        'autre': 'Autre',
        'applique': 'Applique',
        'tunnel': 'Tunnel',
        'feuillure': 'Feuillure',
        'renovation': 'Rénovation',
        'pvc': 'PVC',
        'aluminium': 'Aluminium',
        'bois': 'Bois',
        'bois-alu': 'Bois-Aluminium',
        'simple': 'Simple',
        'double': 'Double',
        'triple': 'Triple'
    };
    return labels[value] || value;
}

// Générer le PDF
function generatePDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    const schema = schémas[data.menuiserieType] || schémas['autre'];
    const prixTotal = (data.prixUnitaire * data.quantite) * (1 - data.remise / 100);
    
    let yPosition = 10;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const maxWidth = 190;
    
    // HEADER
    doc.setFontSize(16);
    doc.text('Devis de Cotation Menuiserie', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.text(`Date d'édition : ${data.dateEdition}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Validité : jusqu'au ${data.dateValidite}`, margin, yPosition);
    yPosition += 10;
    
    // CLIENT
    doc.setFontSize(12);
    doc.text('CLIENT', margin, yPosition);
    yPosition += 5;
    doc.setFontSize(10);
    doc.text(`Nom : ${data.clientName}`, margin, yPosition);
    yPosition += 4;
    doc.text(`Email : ${data.clientEmail}`, margin, yPosition);
    yPosition += 4;
    doc.text(`Téléphone : ${data.clientPhone || 'N/A'}`, margin, yPosition);
    yPosition += 4;
    doc.text(`Adresse : ${data.clientAddress || 'N/A'}`, margin, yPosition);
    yPosition += 10;
    
    // SPÉCIFICATIONS
    doc.setFontSize(12);
    doc.text('SPÉCIFICATIONS', margin, yPosition);
    yPosition += 5;
    doc.setFontSize(10);
    doc.text(`Type : ${getLabel(data.menuiserieType)}`, margin, yPosition);
    yPosition += 4;
    doc.text(`Pose : ${getLabel(data.typeDepose)}`, margin, yPosition);
    yPosition += 4;
    doc.text(`Dimensions : ${data.largeur} mm × ${data.hauteur} mm`, margin, yPosition);
    yPosition += 4;
    doc.text(`Matériau : ${getLabel(data.materiau)}`, margin, yPosition);
    yPosition += 4;
    doc.text(`Vitrage : ${getLabel(data.vitrage)}`, margin, yPosition);
    yPosition += 4;
    doc.text(`Couleur : ${data.couleur || 'N/A'}`, margin, yPosition);
    yPosition += 6;
    
    if (data.observation) {
        doc.text(`Observations : ${data.observation}`, margin, yPosition);
        yPosition += 6;
    }
    
    // Vérifier si on a besoin d'une nouvelle page avant la tarification
    if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 10;
    }
    
    // TARIFICATION
    doc.setFontSize(12);
    doc.text('TARIFICATION', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.text(`Prix unitaire : ${data.prixUnitaire.toFixed(2)} €`, margin, yPosition);
    yPosition += 4;
    doc.text(`Quantité : ${data.quantite}`, margin, yPosition);
    yPosition += 4;
    doc.text(`Sous-total : ${(data.prixUnitaire * data.quantite).toFixed(2)} €`, margin, yPosition);
    yPosition += 4;
    
    if (data.remise > 0) {
        doc.text(`Remise (${data.remise}%) : -${((data.prixUnitaire * data.quantite * data.remise) / 100).toFixed(2)} €`, margin, yPosition);
        yPosition += 4;
    }
    
    doc.setFontSize(12);
    doc.text(`TOTAL TTC : ${prixTotal.toFixed(2)} €`, margin, yPosition);
    yPosition += 6;
    
    doc.setFontSize(10);
    doc.text(`Délai de livraison : ${data.delai} jours`, margin, yPosition);
    yPosition += 10;
    
    // FOOTER
    doc.setFontSize(9);
    doc.text(`Devis établi le ${data.dateEdition} - Merci de votre confiance !`, margin, pageHeight - 10);
    
    // Générer le PDF
    doc.save(`devis_${data.clientName.replace(/\s+/g, '_')}_${data.dateEdition.replace(/\//g, '-')}.pdf`);
}
