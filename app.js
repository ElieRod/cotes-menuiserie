// ============================================================
// COTATION MENUISERIES - APP.JS (corrigé)
// Aligné sur les IDs/éléments du HTML
// ============================================================

// ============================================================
// 1. CHARGEMENT DES DONNÉES
// ============================================================

let menuiseries = []; // Stockage des menuiseries saisies

// Charger les données du localStorage au démarrage
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('menuiseries');
  if (saved) {
    try {
      menuiseries = JSON.parse(saved);
    } catch (e) {
      console.error('Erreur chargement localStorage:', e);
    }
  }
  displayMenuiseries();
});

// ============================================================
// 2. AJOUTER UNE MENUISERIE
// ============================================================

document.getElementById('addMenuiserie').addEventListener('click', () => {
  // Récupérer les valeurs du formulaire
  const type = document.getElementById('menuiserieType')?.value || '';
  const model = document.getElementById('menuiserieModel')?.value || '';
  const largeur = document.getElementById('menuiserieLargeur')?.value || '';
  const hauteur = document.getElementById('menuiserieHauteur')?.value || '';
  const quantite = document.getElementById('menuiserieQuantite')?.value || '1';
  const position = document.getElementById('menuiseriePosition')?.value || '';

  // Validation basique
  if (!type || !largeur || !hauteur) {
    alert('Veuillez remplir : Type, Largeur, Hauteur');
    return;
  }

  // Ajouter à la liste
  const newMenuiserie = {
    id: Date.now(),
    type,
    model,
    largeur,
    hauteur,
    quantite,
    position,
    coutUnitaire: 0
  };

  menuiseries.push(newMenuiserie);
  localStorage.setItem('menuiseries', JSON.stringify(menuiseries));

  // Réinitialiser le formulaire
  document.getElementById('quoteForm').reset();
  displayMenuiseries();
});

// ============================================================
// 3. AFFICHER LA LISTE DES MENUISERIES
// ============================================================

function displayMenuiseries() {
  const container = document.getElementById('menuiseriesList');
  
  if (menuiseries.length === 0) {
    container.innerHTML = '<p style="color: #999;">Aucune menuiserie ajoutée</p>';
    return;
  }

  container.innerHTML = menuiseries.map((m, idx) => `
    <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 4px; background: #f9f9f9;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>${escapeHtml(m.type)}</strong>
          ${m.model ? `<br><small>Modèle : ${escapeHtml(m.model)}</small>` : ''}
          <br><small>${m.largeur} × ${m.hauteur} mm | Qty: ${m.quantite}</small>
          ${m.position ? `<br><small>Pose : ${escapeHtml(m.position)}</small>` : ''}
        </div>
        <button onclick="deleteMenuiserie(${m.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Supprimer</button>
      </div>
    </div>
  `).join('');
}

// ============================================================
// 4. SUPPRIMER UNE MENUISERIE
// ============================================================

function deleteMenuiserie(id) {
  menuiseries = menuiseries.filter(m => m.id !== id);
  localStorage.setItem('menuiseries', JSON.stringify(menuiseries));
  displayMenuiseries();
}

// ============================================================
// 5. ÉCHAPPER LE HTML
// ============================================================

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================================
// 6. GÉNÉRER LE RAPPORT PDF
// ============================================================

function generateReport() {
  const clientName = document.getElementById('clientName')?.value || 'Client';
  const projectAddress = document.getElementById('projectAddress')?.value || '';
  const projectDate = document.getElementById('projectDate')?.value || new Date().toISOString().split('T')[0];

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rapport Menuiserie</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          background: white;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 15px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #333;
        }
        .header p {
          margin: 5px 0;
          color: #666;
          font-size: 14px;
        }
        .project-info {
          background: #f5f5f5;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 4px;
          border-left: 4px solid #3498db;
        }
        .project-info p {
          margin: 5px 0;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        thead {
          background: #e8e8e8;
        }
        th, td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: left;
        }
        th {
          font-weight: bold;
          color: #333;
        }
        td {
          font-size: 14px;
        }
        .text-right {
          text-align: right;
        }
        .total-row {
          background: #f0f0f0;
          font-weight: bold;
        }
        h3 {
          margin-top: 30px;
          margin-bottom: 15px;
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #999;
          font-size: 12px;
        }
        @media print {
          body { margin: 0; padding: 10px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 Rapport Menuiserie</h1>
        <p>Estimation des Ouvertures</p>
      </div>

      <div class="project-info">
        <p><strong>Client :</strong> ${escapeHtml(clientName)}</p>
        <p><strong>Adresse du projet :</strong> ${escapeHtml(projectAddress)}</p>
        <p><strong>Date :</strong> ${projectDate}</p>
      </div>

      <h3 style="color: #555;">🪟 MENUISERIES</h3>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-right">Largeur (mm)</th>
            <th class="text-right">Hauteur (mm)</th>
            <th class="text-right">Quantité</th>
            <th class="text-right">Coût Unitaire</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${menuiseries.map((m, idx) => {
            const description = escapeHtml(m.type + (m.model ? ' — ' + m.model : ''));
            const coutUnitaire = (typeof m.coutUnitaire === 'number' && !isNaN(m.coutUnitaire)) ? m.coutUnitaire : 0;
            const total = coutUnitaire * (parseInt(m.quantite, 10) || 1);
            return `
              <tr>
                <td>${description}${m.position ? `<br><small style="color:#777;">Pose : ${escapeHtml(m.position)}</small>` : ''}</td>
                <td class="text-right">${m.largeur}</td>
                <td class="text-right">${m.hauteur}</td>
                <td class="text-right">${m.quantite}</td>
                <td class="text-right">${coutUnitaire.toFixed(2)} €</td>
                <td class="text-right">${total.toFixed(2)} €</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>Généré automatiquement | ${new Date().toLocaleDateString('fr-FR')}</p>
      </div>
    </body>
    </html>
  `;

  return htmlContent;
}

// ============================================================
// 7. TÉLÉCHARGER LE PDF
// ============================================================

document.getElementById('generatePdf')?.addEventListener('click', () => {
  if (menuiseries.length === 0) {
    alert('Veuillez ajouter au moins une menuiserie');
    return;
  }

  const htmlContent = generateReport();
  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
  }, 500);
});

// ============================================================
// FIN
// ============================================================
