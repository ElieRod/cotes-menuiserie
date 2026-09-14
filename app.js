// ====================================
// COTATION MENUISERIES - APP.JS
// ====================================

// Import des schémas
const SCHEMAS = DISPONIBLE_SCHEMAS;

// État de l'application
let menuiseries = [];
let menuiserieCounter = 0;

// ====================================
// FONCTIONS UTILITAIRES
// ====================================

function generateId() {
    return `menuiserie_${++menuiserieCounter}`;
}

function getCotationData() {
    return {
        client: document.getElementById('client').value,
        reference: document.getElementById('reference').value,
        date: document.getElementById('date').value
    };
}

function getMenuiserieData(id) {
    const elem = document.getElementById(id);
    return {
        id,
        bicoloration: elem.querySelector(`[data-field="bicoloration_${id}"]`).value,
        pose: elem.querySelector(`[data-field="pose_${id}"]`).value,
        ouvertures: getOuverturesData(id)
    };
}

function getOuverturesData(menuiserieId) {
    const ouvertures = [];
    const container = document.querySelector(`[data-menuiserie="${menuiserieId}"] .ouvertures-container`);
    
    if (!container) return ouvertures;

    container.querySelectorAll('.ouverture-item').forEach((item, index) => {
        const typeSelect = item.querySelector(`[data-field="type_${menuiserieId}_${index}"]`);
        const largeursInput = item.querySelector(`[data-field="largeurs_${menuiserieId}_${index}"]`);
        const hauteursInput = item.querySelector(`[data-field="hauteurs_${menuiserieId}_${index}"]`);
        const schemaSelect = item.querySelector(`[data-field="schema_${menuiserieId}_${index}"]`);
        
        if (typeSelect && largeursInput && hauteursInput && schemaSelect) {
            ouvertures.push({
                type: typeSelect.value,
                largeurs: largeursInput.value.split(',').map(v => v.trim()).filter(v => v),
                hauteurs: hauteursInput.value.split(',').map(v => v.trim()).filter(v => v),
                schema: schemaSelect.value
            });
        }
    });

    return ouvertures;
}

// ====================================
// GESTION MENUISERIES
// ====================================

function addMenuiserie() {
    const id = generateId();
    menuiseries.push(id);
    renderMenuiserie(id);
}

function removeMenuiserie(id) {
    menuiseries = menuiseries.filter(m => m !== id);
    document.querySelector(`[data-menuiserie="${id}"]`).remove();
}

function renderMenuiserie(id) {
    const container = document.getElementById('menuiseriesContainer');
    const menuiserieDiv = document.createElement('div');
    menuiserieDiv.setAttribute('data-menuiserie', id);
    menuiserieDiv.className = 'menuiserie-section';

    menuiserieDiv.innerHTML = `
        <div class="menuiserie-header">
            <h3>Menuiserie #${menuiseries.indexOf(id) + 1}</h3>
            <button type="button" class="btn-danger" data-remove="${id}">✕ Supprimer</button>
        </div>

        <div class="form-group">
            <label for="bicoloration_${id}">Bicoloration</label>
            <select id="bicoloration_${id}" data-field="bicoloration_${id}" required>
                <option value="">-- Choisir --</option>
                <option value="Mono">Mono</option>
                <option value="Bi">Bi</option>
            </select>
        </div>

        <div class="form-group">
            <label for="pose_${id}">Type de pose</label>
            <select id="pose_${id}" data-field="pose_${id}" required>
                <option value="">-- Choisir --</option>
                <option value="Applique">Applique</option>
                <option value="Tunnel">Tunnel</option>
                <option value="Feuillure">Feuillure</option>
                <option value="Rénovation">Rénovation</option>
            </select>
        </div>

        <div class="ouvertures-container"></div>
        <button type="button" class="btn-secondary" data-add-ouverture="${id}">+ Ajouter une ouverture</button>
    `;

    container.appendChild(menuiserieDiv);

    // Event listeners
    menuiserieDiv.querySelector(`[data-remove="${id}"]`).addEventListener('click', () => removeMenuiserie(id));
    menuiserieDiv.querySelector(`[data-add-ouverture="${id}"]`).addEventListener('click', () => addOuverture(id));

    // Ajouter une première ouverture par défaut
    addOuverture(id);
}

// ====================================
// GESTION OUVERTURES
// ====================================

function addOuverture(menuiserieId) {
    const menuiserieDiv = document.querySelector(`[data-menuiserie="${menuiserieId}"]`);
    const container = menuiserieDiv.querySelector('.ouvertures-container');
    const index = container.querySelectorAll('.ouverture-item').length;

    const ouvertureDiv = document.createElement('div');
    ouvertureDiv.className = 'ouverture-item';
    ouvertureDiv.innerHTML = `
        <h4>Ouverture ${index + 1}</h4>
        
        <div class="form-group">
            <label for="type_${menuiserieId}_${index}">Type d'ouverture</label>
            <select id="type_${menuiserieId}_${index}" data-field="type_${menuiserieId}_${index}" required>
                <option value="">-- Choisir --</option>
                <option value="Fenêtre">Fenêtre</option>
                <option value="Porte">Porte</option>
                <option value="Baie vitrée">Baie vitrée</option>
                <option value="Autre">Autre</option>
            </select>
        </div>

        <div class="form-group">
            <label for="largeurs_${menuiserieId}_${index}">Largeurs (mm, séparées par virgule)</label>
            <input type="text" id="largeurs_${menuiserieId}_${index}" data-field="largeurs_${menuiserieId}_${index}" placeholder="Ex: 1000, 1200, 1500">
        </div>

        <div class="form-group">
            <label for="hauteurs_${menuiserieId}_${index}">Hauteurs (mm, séparées par virgule)</label>
            <input type="text" id="hauteurs_${menuiserieId}_${index}" data-field="hauteurs_${menuiserieId}_${index}" placeholder="Ex: 1200, 1500">
        </div>

        <div class="form-group">
            <label for="schema_${menuiserieId}_${index}">Schéma</label>
            <select id="schema_${menuiserieId}_${index}" data-field="schema_${menuiserieId}_${index}" required>
                <option value="">-- Choisir --</option>
                ${Object.entries(SCHEMAS).map(([key, label]) => `<option value="${key}">${label}</option>`).join('')}
            </select>
        </div>

        <div class="schema-preview" id="preview_${menuiserieId}_${index}"></div>
        
        <button type="button" class="btn-secondary btn-small" data-remove-ouverture="${menuiserieId}_${index}">✕ Supprimer</button>
    `;

    container.appendChild(ouvertureDiv);

    // Event listeners
    const schemaSelect = ouvertureDiv.querySelector(`[data-field="schema_${menuiserieId}_${index}"]`);
    schemaSelect.addEventListener('change', () => {
        updateSchemaPreview(menuiserieId, index);
    });

    ouvertureDiv.querySelector(`[data-remove-ouverture="${menuiserieId}_${index}"]`).addEventListener('click', () => {
        ouvertureDiv.remove();
    });
}

function updateSchemaPreview(menuiserieId, index) {
    const schemaSelect = document.querySelector(`[data-field="schema_${menuiserieId}_${index}"]`);
    const previewDiv = document.getElementById(`preview_${menuiserieId}_${index}`);
    const schemaKey = schemaSelect.value;

    if (!schemaKey) {
        previewDiv.innerHTML = '';
        return;
    }

    // Charger le SVG
    const svgPath = `assets/schemas/${schemaKey}.svg`;
    fetch(svgPath)
        .then(response => response.text())
        .then(svgContent => {
            previewDiv.innerHTML = svgContent;
            previewDiv.querySelector('svg').style.maxWidth = '200px';
            previewDiv.querySelector('svg').style.height = 'auto';
        })
        .catch(err => console.error('Erreur chargement SVG:', err));
}

// ====================================
// GÉNÉRATION PDF
// ====================================

function generatePDF() {
    // Validation basique
    if (!document.getElementById('client').value) {
        alert('Veuillez remplir le nom du client');
        return;
    }

    const cotationData = getCotationData();
    const allMenuiseries = menuiseries.map(id => getMenuiserieData(id));

    // Créer contenu HTML pour PDF
    const htmlContent = generateHTMLReport(cotationData, allMenuiseries);

    // Créer blob et télécharger
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cotation_${cotationData.reference || 'menuiseries'}_${cotationData.date}.html`;
    a.click();
}

function generateHTMLReport(cotation, menuiseries) {
    let html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>Rapport Cotation</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; text-align: center; }
            .cotation-header { background: #f0f0f0; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
            .cotation-header p { margin: 8px 0; }
            .menuiserie-section { page-break-inside: avoid; margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
            .menuiserie-section h2 { color: #0066cc; margin-top: 0; }
            .ouverture-item { margin: 15px 0; padding: 10px; background: #fafafa; border-left: 4px solid #0066cc; }
            .schema-img { max-width: 300px; margin: 10px 0; }
            .dims { margin: 10px 0; font-size: 14px; }
        </style>
    </head>
    <body>
        <h1>📋 Rapport Cotation Menuiseries</h1>
        <div class="cotation-header">
            <p><strong>Client:</strong> ${cotation.client}</p>
            <p><strong>Référence:</strong> ${cotation.reference}</p>
            <p><strong>Date:</strong> ${cotation.date}</p>
        </div>
    `;

    menuiseries.forEach((menu, idx) => {
        html += `
        <div class="menuiserie-section">
            <h2>Menuiserie ${idx + 1}</h2>
            <p><strong>Bicoloration:</strong> ${menu.bicoloration}</p>
            <p><strong>Type de pose:</strong> ${menu.pose}</p>
        `;

        menu.ouvertures.forEach((ouv, ouvIdx) => {
            html += `
            <div class="ouverture-item">
                <h3>Ouverture ${ouvIdx + 1}</h3>
                <p><strong>Type:</strong> ${ouv.type}</p>
                <div class="dims">
                    <strong>Largeurs (mm):</strong> ${ouv.largeurs.join(', ')}
                </div>
                <div class="dims">
                    <strong>Hauteurs (mm):</strong> ${ouv.hauteurs.join(', ')}
                </div>
                ${ouv.schema ? `<div class="schema-info"><strong>Schéma:</strong> ${SCHEMAS[ouv.schema]}</div>` : ''}
            </div>
            `;
        });

        html += `</div>`;
    });

    html += `
        <footer style="margin-top: 50px; text-align: center; color: #999; font-size: 12px;">
            <p>Généré le ${new Date().toLocaleString('fr-FR')}</p>
        </footer>
    </body>
    </html>
    `;

    return html;
}

// ====================================
// INITIALIZATION
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    // Définir la date du jour par défaut
    document.getElementById('date').valueAsDate = new Date();

    // Event listeners
    document.getElementById('addMenuiserie').addEventListener('click', addMenuiserie);
    document.getElementById('generatePdf').addEventListener('click', generatePDF);

    // Ajouter une première menuiserie
    addMenuiserie();
});
