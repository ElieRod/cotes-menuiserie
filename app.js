// Gestion du formulaire de cotation menuiserie
const quoteForm = document.getElementById('quoteForm');
const reportSection = document.getElementById('report');
const reportContent = document.getElementById('reportContent');

// Charger les schémas
let menuiserieSchemas = {};
loadSchemas();

function loadSchemas() {
  if (typeof schemas !== 'undefined') {
    menuiserieSchemas = schemas;
  }
}

// Ajouter une menuiserie
function addMenuiserie() {
  const container = document.getElementById('menuiseries-container');
  const index = container.children.length;
  
  const menuiserieDiv = document.createElement('div');
  menuiserieDiv.className = 'menuiserie-item';
  menuiserieDiv.innerHTML = `
    <h3>Menuiserie ${index + 1}</h3>
    <div class="form-group">
      <label for="type-${index}">Type de menuiserie :</label>
      <select id="type-${index}" class="menuiserie-type" onchange="updateSchema(${index})">
        <option value="">-- Sélectionner --</option>
        <option value="fenetre-1-vantail">Fenêtre 1 vantail</option>
        <option value="fenetre-2-vantaux">Fenêtre 2 vantaux</option>
        <option value="porte-1-vantail">Porte 1 vantail</option>
        <option value="porte-2-vantaux">Porte 2 vantaux</option>
        <option value="coulissant">Coulissant</option>
        <option value="oscillo-battant">Oscillo-battant</option>
        <option value="chassis-fixe">Châssis fixe</option>
        <option value="autre">Autre</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="pose-${index}">Type de pose :</label>
      <select id="pose-${index}">
        <option value="Applique">Applique</option>
        <option value="Tunnel">Tunnel</option>
        <option value="Feuillure">Feuillure</option>
        <option value="Rénovation">Rénovation</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="largeur-${index}">Largeur (mm) :</label>
      <input type="number" id="largeur-${index}" min="100" max="5000" value="1000" required>
    </div>
    
    <div class="form-group">
      <label for="hauteur-${index}">Hauteur (mm) :</label>
      <input type="number" id="hauteur-${index}" min="100" max="5000" value="1200" required>
    </div>
    
    <div class="form-group">
      <label for="materiau-${index}">Matériau :</label>
      <select id="materiau-${index}">
        <option value="PVC">PVC</option>
        <option value="Aluminium">Aluminium</option>
        <option value="Bois">Bois</option>
        <option value="Bois-Aluminium">Bois-Aluminium</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="vitrage-${index}">Type de vitrage :</label>
      <select id="vitrage-${index}">
        <option value="Simple">Simple</option>
        <option value="Double">Double</option>
        <option value="Triple">Triple</option>
      </select>
    </div>
    
    <div class="schema-preview" id="schema-${index}">
      <svg viewBox="0 0 200 200" width="150" height="150">
        <rect width="200" height="200" fill="#e0e0e0" stroke="#999" stroke-width="2"/>
        <text x="100" y="100" text-anchor="middle" dy="0.3em" fill="#999">Sélectionner un type</text>
      </svg>
    </div>
    
    <button type="button" class="btn-danger" onclick="removeMenuiserie(this)">Supprimer</button>
  `;
  
  container.appendChild(menuiserieDiv);
}

// Mettre à jour le schéma SVG
function updateSchema(index) {
  const typeSelect = document.getElementById(`type-${index}`);
  const type = typeSelect.value;
  const schemaContainer = document.getElementById(`schema-${index}`);
  
  if (type && menuiserieSchemas[type]) {
    schemaContainer.innerHTML = menuiserieSchemas[type];
  } else {
    schemaContainer.innerHTML = `
      <svg viewBox="0 0 200 200" width="150" height="150">
        <rect width="200" height="200" fill="#e0e0e0" stroke="#999" stroke-width="2"/>
        <text x="100" y="100" text-anchor="middle" dy="0.3em" fill="#999">Schéma non disponible</text>
      </svg>
    `;
  }
}

// Supprimer une menuiserie
function removeMenuiserie(button) {
  button.parentElement.remove();
}

// Générer le rapport
function generateReport() {
  const container = document.getElementById('menuiseries-container');
  const menuiseries = container.querySelectorAll('.menuiserie-item');
  
  if (menuiseries.length === 0) {
    alert('Veuillez ajouter au moins une menuiserie');
    return;
  }
  
  // Récupérer les informations client
  const client = document.getElementById('client').value.trim() || 'Client';
  const adresse = document.getElementById('adresse').value.trim() || 'Adresse non spécifiée';
  const codePostal = document.getElementById('codePostal').value.trim() || '';
  const ville = document.getElementById('ville').value.trim() || '';
  const telephone = document.getElementById('telephone').value.trim() || '';
  const email = document.getElementById('email').value.trim() || '';
  
  // Construire le HTML du rapport
  let reportHTML = `
    <div class="report-header">
      <h1>📋 Rapport de Cotation Menuiserie</h1>
      <p class="report-date">Date : ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>
    
    <div class="report-section">
      <h2>Informations Client</h2>
      <table class="report-table">
        <tr>
          <td><strong>Nom :</strong></td>
          <td>${escapeHtml(client)}</td>
        </tr>
        <tr>
          <td><strong>Adresse :</strong></td>
          <td>${escapeHtml(adresse)}</td>
        </tr>
        <tr>
          <td><strong>Localité :</strong></td>
          <td>${escapeHtml(codePostal)} ${escapeHtml(ville)}</td>
        </tr>
        <tr>
          <td><strong>Téléphone :</strong></td>
          <td>${escapeHtml(telephone)}</td>
        </tr>
        <tr>
          <td><strong>Email :</strong></td>
          <td>${escapeHtml(email)}</td>
        </tr>
      </table>
    </div>
    
    <div class="report-section">
      <h2>Détail des Menuiseries</h2>
  `;
  
  let totalPrice = 0;
  
  menuiseries.forEach((item, idx) => {
    const type = document.getElementById(`type-${idx}`).value;
    const pose = document.getElementById(`pose-${idx}`).value;
    const largeur = parseInt(document.getElementById(`largeur-${idx}`).value) || 0;
    const hauteur = parseInt(document.getElementById(`hauteur-${idx}`).value) || 0;
    const materiau = document.getElementById(`materiau-${idx}`).value;
    const vitrage = document.getElementById(`vitrage-${idx}`).value;
    
    const surface = (largeur * hauteur) / 1000000; // en m²
    const prixBase = calculatePrice(type, materiau, surface);
    const remise = prixBase * 0.10; // 10% de remise
    const prixFinal = prixBase - remise;
    totalPrice += prixFinal;
    
    reportHTML += `
      <div class="menuiserie-details">
        <h3>Menuiserie ${idx + 1}</h3>
        <table class="report-table">
          <tr>
            <td><strong>Type :</strong></td>
            <td>${escapeHtml(type.replace(/-/g, ' ').toUpperCase())}</td>
          </tr>
          <tr>
            <td><strong>Type de pose :</strong></td>
            <td>${escapeHtml(pose)}</td>
          </tr>
          <tr>
            <td><strong>Dimensions :</strong></td>
            <td>${largeur} mm (L) × ${hauteur} mm (H) = ${surface.toFixed(2)} m²</td>
          </tr>
          <tr>
            <td><strong>Matériau :</strong></td>
            <td>${escapeHtml(materiau)}</td>
          </tr>
          <tr>
            <td><strong>Vitrage :</strong></td>
            <td>${escapeHtml(vitrage)}</td>
          </tr>
          <tr>
            <td><strong>Prix unitaire :</strong></td>
            <td>${prixBase.toFixed(2)} €</td>
          </tr>
          <tr>
            <td><strong>Remise (10%) :</strong></td>
            <td>-${remise.toFixed(2)} €</td>
          </tr>
          <tr>
            <td><strong>Prix TTC :</strong></td>
            <td><strong>${prixFinal.toFixed(2)} €</strong></td>
          </tr>
        </table>
      </div>
    `;
  });
  
  reportHTML += `
    </div>
    
    <div class="report-section report-footer">
      <h2>Récapitulatif</h2>
      <table class="report-table">
        <tr>
          <td><strong>Nombre de menuiseries :</strong></td>
          <td>${menuiseries.length}</td>
        </tr>
        <tr>
          <td><strong>Total TTC :</strong></td>
          <td><strong style="color: #667eea; font-size: 1.2em;">${totalPrice.toFixed(2)} €</strong></td>
        </tr>
      </table>
      <p style="text-align: center; margin-top: 20px; font-style: italic;">
        Merci pour votre confiance ! 🙏
      </p>
    </div>
  `;
  
  reportContent.innerHTML = reportHTML;
  reportSection.style.display = 'block';
  reportSection.scrollIntoView({ behavior: 'smooth' });
}

// Calculer le prix
function calculatePrice(type, materiau, surface) {
  const basePrice = {
    'fenetre-1-vantail': 250,
    'fenetre-2-vantaux': 400,
    'porte-1-vantail': 350,
    'porte-2-vantaux': 500,
    'coulissant': 450,
    'oscillo-battant': 300,
    'chassis-fixe': 200,
    'autre': 300
  };
  
  const materiauMultiplier = {
    'PVC': 1.0,
    'Aluminium': 1.5,
    'Bois': 2.0,
    'Bois-Aluminium': 2.5
  };
  
  const prix = (basePrice[type] || 300) * (materiauMultiplier[materiau] || 1) * (1 + surface * 0.1);
  return prix;
}

// Échapper les caractères HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Générer le PDF
async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const html2canvas = window.html2canvas;
  
  if (!jsPDF || !html2canvas) {
    alert('Les bibliothèques PDF ne sont pas chargées. Vérifiez votre connexion internet.');
    return;
  }
  
  if (!reportContent.innerHTML.trim()) {
    alert('Veuillez générer un aperçu du rapport en premier');
    return;
  }
  
  const element = reportContent;
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210; // Largeur A4 en mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  let heightLeft = imgHeight;
  let position = 0;
  
  while (heightLeft > 0) {
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // Hauteur A4 en mm
    position += 297;
    if (heightLeft > 0) {
      pdf.addPage();
    }
  }
  
  // Télécharger le PDF
  const client = document.getElementById('client').value.trim() || 'rapport';
  pdf.save(`cotation-${client}-${new Date().getTime()}.pdf`);
}

// Réinitialiser le formulaire
function resetForm() {
  quoteForm.reset();
  const container = document.getElementById('menuiseries-container');
  container.innerHTML = '';
  reportSection.style.display = 'none';
  addMenuiserie(); // Ajouter une menuiserie par défaut
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
  // Ajouter une menuiserie par défaut
  addMenuiserie();
  
  // Écouter la soumission du formulaire
  if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      generateReport();
    });
  }
  
  // Charger les schémas
  loadSchemas();
});
