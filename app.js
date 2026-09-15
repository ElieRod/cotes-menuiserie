// ============================================================
// COTATION MENUISERIES - APP.JS (CORRIGÉ)
// Aligné sur les IDs réels du HTML
// ============================================================

const TYPES = {
  fenetre: { label: 'Fenêtre', color: '#3498db' },
  porte: { label: 'Porte', color: '#e74c3c' },
  baie: { label: 'Baie vitrée', color: '#2ecc71' },
  volet: { label: 'Volet', color: '#f39c12' }
};

const POSES = {
  applique: 'En applique',
  tunnel: 'En tunnel',
  feuillure: 'En feuillure'
};

const MATERIAUX = {
  pvc: 'PVC',
  alu: 'Aluminium',
  bois: 'Bois',
  composite: 'Composite'
};

const VITRAGES = {
  simple: 'Simple',
  double: 'Double',
  triple: 'Triple'
};

let menuiseries = [];
let currentEditIndex = null;

// ========== VÉRIFICATION DES ÉLÉMENTS CRITIQUES ==========
document.addEventListener('DOMContentLoaded', function() {
  const criticalElements = [
    '#menuiseriesContainer',
    '#addMenuiserie',
    '#generatePdf'
  ];

  for (const selector of criticalElements) {
    if (!document.querySelector(selector)) {
      console.error(`❌ Élément manquant : ${selector}`);
      return;
    }
  }

  console.log('✅ Tous les éléments critiques présents');
  initializeApp();
});

function initializeApp() {
  const addBtn = document.getElementById('addMenuiserie');
  const generateBtn = document.getElementById('generatePdf');

  // Bouton Ajouter menuiserie
  if (addBtn) {
    addBtn.addEventListener('click', openMenuiserieModal);
  }

  // Bouton Générer PDF
  if (generateBtn) {
    generateBtn.addEventListener('click', generatePDF);
  }

  // Fermer modal avec X
  const closeBtn = document.querySelector('.close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenuiserieModal);
  }

  // Soumettre formulaire
  const form = document.getElementById('menuiserieForm');
  if (form) {
    form.addEventListener('submit', saveMenuiserie);
  }

  // Fermer modal en cliquant dehors
  const modal = document.getElementById('menuiserieModal');
  if (modal) {
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeMenuiserieModal();
      }
    });
  }

  loadMenuiseries();
}

// ========== MODAL MENUISERIE ==========
function openMenuiserieModal() {
  currentEditIndex = null;
  document.getElementById('menuiserieForm').reset();
  document.getElementById('menuiserieModal').style.display = 'block';
  document.getElementById('formTitle').textContent = 'Ajouter une menuiserie';
}

function closeMenuiserieModal() {
  document.getElementById('menuiserieModal').style.display = 'none';
  currentEditIndex = null;
}

function saveMenuiserie(e) {
  e.preventDefault();

  const menuiserie = {
    type: document.getElementById('menuisery').value,
    pose: document.getElementById('pose').value,
    width: parseFloat(document.getElementById('width').value),
    height: parseFloat(document.getElementById('height').value,
    material: document.getElementById('material').value,
    glazing: document.getElementById('glazing').value,
    notes: document.getElementById('notes').value || ''
  };

  if (!menuiserie.type || !menuiserie.pose || !menuiserie.width || !menuiserie.height) {
    alert('❌ Veuillez remplir tous les champs obligatoires');
    return;
  }

  if (currentEditIndex !== null) {
    menuiseries[currentEditIndex] = menuiserie;
  } else {
    menuiseries.push(menuiserie);
  }

  saveMenuiseries();
  closeMenuiserieModal();
  displayMenuiseries();
}

// ========== AFFICHAGE DES MENUISERIES ==========
function displayMenuiseries() {
  const container = document.getElementById('menuiseriesContainer');
  container.innerHTML = '';

  if (menuiseries.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999;">Aucune menuiserie ajoutée</p>';
    return;
  }

  menuiseries.forEach((m, index) => {
    const card = document.createElement('div');
    card.className = 'menuiserie-card';
    card.style.borderLeft = `5px solid ${TYPES[m.type]?.color || '#999'}`;

    card.innerHTML = `
      <div class="menuiserie-header">
        <h3>${TYPES[m.type]?.label || m.type}</h3>
        <span class="badge">${m.width} × ${m.height} mm</span>
      </div>
      <div class="menuiserie-details">
        <p><strong>Pose :</strong> ${POSES[m.pose] || m.pose}</p>
        <p><strong>Matériau :</strong> ${MATERIAUX[m.material] || m.material}</p>
        <p><strong>Vitrage :</strong> ${VITRAGES[m.glazing] || m.glazing}</p>
        ${m.notes ? `<p><strong>Notes :</strong> ${escapeHtml(m.notes)}</p>` : ''}
      </div>
      <div class="menuiserie-actions">
        <button class="btn-edit" onclick="editMenuiserie(${index})">✏️ Éditer</button>
        <button class="btn-delete" onclick="deleteMenuiserie(${index})">🗑️ Supprimer</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function editMenuiserie(index) {
  currentEditIndex = index;
  const m = menuiseries[index];

  document.getElementById('menuisery').value = m.type;
  document.getElementById('pose').value = m.pose;
  document.getElementById('width').value = m.width;
  document.getElementById('height').value = m.height;
  document.getElementById('material').value = m.material;
  document.getElementById('glazing').value = m.glazing;
  document.getElementById('notes').value = m.notes || '';

  document.getElementById('formTitle').textContent = 'Éditer une menuiserie';
  document.getElementById('menuiserieModal').style.display = 'block';
}

function deleteMenuiserie(index) {
  if (confirm('❌ Êtes-vous sûr de vouloir supprimer cette menuiserie ?')) {
    menuiseries.splice(index, 1);
    saveMenuiseries();
    displayMenuiseries();
  }
}

// ========== SAUVEGARDE LOCALE ==========
function saveMenuiseries() {
  localStorage.setItem('menuiseries', JSON.stringify(menuiseries));
}

function loadMenuiseries() {
  const saved = localStorage.getItem('menuiseries');
  menuiseries = saved ? JSON.parse(saved) : [];
  displayMenuiseries();
}

// ========== GÉNÉRATION PDF ==========
async function generatePDF() {
  if (menuiseries.length === 0) {
    alert('⚠️ Aucune menuiserie à exporter');
    return;
  }

  // Créer un contenu HTML à imprimer
  let pdfContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Rapport Menuiseries</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        .menuiserie { 
          page-break-inside: avoid;
          border: 1px solid #ddd; 
          padding: 15px; 
          margin: 20px 0;
          background: #f9f9f9;
        }
        .menuiserie-type { 
          font-size: 18px; 
          font-weight: bold; 
          color: #2c3e50;
          margin-bottom: 10px;
        }
        .detail { margin: 8px 0; }
        .label { font-weight: bold; color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #3498db; color: white; }
        .summary { 
          margin-top: 30px; 
          padding: 15px; 
          background: #ecf0f1; 
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <h1>📋 Rapport Menuiseries</h1>
      <p><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
  `;

  // Ajouter chaque menuiserie
  menuiseries.forEach((m, index) => {
    pdfContent += `
      <div class="menuiserie">
        <div class="menuiserie-type">${index + 1}. ${TYPES[m.type]?.label || m.type}</div>
        <div class="detail"><span class="label">Dimensions :</span> ${m.width} mm × ${m.height} mm</div>
        <div class="detail"><span class="label">Pose :</span> ${POSES[m.pose] || m.pose}</div>
        <div class="detail"><span class="label">Matériau :</span> ${MATERIAUX[m.material] || m.material}</div>
        <div class="detail"><span class="label">Vitrage :</span> ${VITRAGES[m.glazing] || m.glazing}</div>
        ${m.notes ? `<div class="detail"><span class="label">Notes :</span> ${escapeHtml(m.notes)}</div>` : ''}
      </div>
    `;
  });

  // Ajouter un résumé
  pdfContent += `
    <div class="summary">
      <h2>📊 Résumé</h2>
      <p><strong>Nombre total de menuiseries :</strong> ${menuiseries.length}</p>
    </div>
    </body>
    </html>
  `;

  // Ouvrir dans une nouvelle fenêtre pour imprimer/télécharger
  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(pdfContent);
  printWindow.document.close();
  printWindow.print();
}

// ========== ECHAPPER HTML ==========
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
