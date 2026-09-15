// Sélecteurs d'éléments du DOM
const menuiseriesList = document.getElementById('menuiseriesList');
const addMenuiserieBtn = document.getElementById('addMenuiserie');
const generatePdfBtn = document.getElementById('generatePdf');
const menuiserieTemplate = document.getElementById('menuiserieTemplate');
const quoteForm = document.getElementById('quoteForm');

// Vérifier que tous les éléments existent
if (!menuiseriesList || !addMenuiserieBtn || !generatePdfBtn || !menuiserieTemplate || !quoteForm) {
  console.error('Erreur: Les éléments HTML requis ne sont pas trouvés');
  console.log('menuiseriesList:', menuiseriesList);
  console.log('addMenuiserieBtn:', addMenuiserieBtn);
  console.log('generatePdfBtn:', generatePdfBtn);
  console.log('menuiserieTemplate:', menuiserieTemplate);
  console.log('quoteForm:', quoteForm);
} else {
  console.log('✓ Tous les éléments HTML trouvés');
}

// Initialiser la liste des menuiseries depuis localStorage
let menuiseries = JSON.parse(localStorage.getItem('menuiseries')) || [];

// Ajouter une nouvelle menuiserie
function addMenuiserie() {
  const menuiserie = {
    id: Date.now(),
    type: document.getElementById('type')?.value || 'Porte',
    largeur: document.getElementById('largeur')?.value || '',
    hauteur: document.getElementById('hauteur')?.value || '',
    profondeur: document.getElementById('profondeur')?.value || '',
    options: document.getElementById('options')?.value || ''
  };

  menuiseries.push(menuiserie);
  saveMenuiseries();
  renderMenuiseries();
  resetForm();
}

// Supprimer une menuiserie
function deleteMenuiserie(id) {
  menuiseries = menuiseries.filter(m => m.id !== id);
  saveMenuiseries();
  renderMenuiseries();
}

// Sauvegarder dans localStorage
function saveMenuiseries() {
  localStorage.setItem('menuiseries', JSON.stringify(menuiseries));
}

// Afficher la liste des menuiseries
function renderMenuiseries() {
  if (!menuiseriesList) return;
  
  menuiseriesList.innerHTML = '';

  if (menuiseries.length === 0) {
    menuiseriesList.innerHTML = '<p class="no-menuiseries">Aucune menuiserie ajoutée</p>';
    return;
  }

  menuiseries.forEach((menuiserie) => {
    const item = document.createElement('div');
    item.className = 'menuiserie-item';
    item.innerHTML = `
      <div class="menuiserie-details">
        <strong>${menuiserie.type}</strong><br>
        Largeur: ${menuiserie.largeur}mm | Hauteur: ${menuiserie.hauteur}mm | Profondeur: ${menuiserie.profondeur}mm<br>
        <small>Options: ${menuiserie.options || 'Aucune'}</small>
      </div>
      <button class="delete-btn" onclick="deleteMenuiserie(${menuiserie.id})">✕ Supprimer</button>
    `;
    menuiseriesList.appendChild(item);
  });
}

// Réinitialiser le formulaire
function resetForm() {
  if (quoteForm) {
    quoteForm.reset();
  }
}

// Générer le rapport PDF
function generatePdf() {
  if (menuiseries.length === 0) {
    alert('Veuillez ajouter au moins une menuiserie');
    return;
  }

  const printWindow = window.open('', '', 'height=600,width=800');
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Rapport Menuiserie</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .menuiserie { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .menuiserie strong { color: #0066cc; }
        .menuiserie p { margin: 5px 0; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <h1>Rapport Devis Menuiserie</h1>
      <p>Date: ${new Date().toLocaleDateString('fr-FR')}</p>
      <hr>
  `;

  menuiseries.forEach((m, index) => {
    html += `
      <div class="menuiserie">
        <h3>Menuiserie ${index + 1}: ${m.type}</h3>
        <p><strong>Largeur:</strong> ${m.largeur}mm</p>
        <p><strong>Hauteur:</strong> ${m.hauteur}mm</p>
        <p><strong>Profondeur:</strong> ${m.profondeur}mm</p>
        <p><strong>Options:</strong> ${m.options || 'Aucune'}</p>
      </div>
    `;
  });

  html += `
    <div class="footer">
      <p>Généré automatiquement - ${new Date().toLocaleString('fr-FR')}</p>
    </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
}

// Événements
if (addMenuiserieBtn) {
  addMenuiserieBtn.addEventListener('click', addMenuiserie);
  console.log('✓ Écouteur ajouté au bouton "Ajouter"');
}

if (generatePdfBtn) {
  generatePdfBtn.addEventListener('click', generatePdf);
  console.log('✓ Écouteur ajouté au bouton "Générer PDF"');
}

// Charger les menuiseries au démarrage
renderMenuiseries();
console.log('✓ Menuiseries chargées au démarrage');
