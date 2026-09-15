// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    attachEventListeners();
});

// Charger les données sauvegardées
function loadFromLocalStorage() {
    const saved = localStorage.getItem('menuiseries');
    if (saved) {
        const menuiseries = JSON.parse(saved);
        menuiseries.forEach(m => addMenuiserieToDOM(m));
    }
}

// Attacher les écouteurs d'événements
function attachEventListeners() {
    const addBtn = document.getElementById('addMenuiserie');
    const generateBtn = document.getElementById('generatePdf');
    const form = document.getElementById('quoteForm');
    
    if (addBtn) {
        addBtn.addEventListener('click', addMenuiserie);
    }
    
    if (generateBtn) {
        generateBtn.addEventListener('click', generateReport);
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }
}

// Ajouter une menuiserie
function addMenuiserie() {
    const template = document.getElementById('menuiserieTemplate');
    if (!template) return;
    
    const clone = template.content.cloneNode(true);
    const container = document.getElementById('menuiseriesList');
    
    if (!container) return;
    
    const item = document.createElement('div');
    item.className = 'menuiserie-item';
    item.appendChild(clone);
    
    container.appendChild(item);
    
    // Attacher les écouteurs au nouveau formulaire
    const removeBtn = item.querySelector('.remove-menuiserie');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            item.remove();
            saveMenuiseries();
        });
    }
    
    // Émettre les changements
    item.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('change', saveMenuiseries);
        field.addEventListener('input', saveMenuiseries);
    });
}

// Ajouter une menuiserie au DOM (depuis localStorage)
function addMenuiserieToDOM(data) {
    const template = document.getElementById('menuiserieTemplate');
    if (!template) return;
    
    const clone = template.content.cloneNode(true);
    const container = document.getElementById('menuiseriesList');
    
    if (!container) return;
    
    const item = document.createElement('div');
    item.className = 'menuiserie-item';
    item.appendChild(clone);
    
    // Remplir les champs avec les données sauvegardées
    const inputs = item.querySelectorAll('input, textarea, select');
    const keys = Object.keys(data);
    
    inputs.forEach((input, index) => {
        if (keys[index] !== undefined) {
            input.value = data[keys[index]];
        }
    });
    
    container.appendChild(item);
    
    // Attacher les écouteurs
    const removeBtn = item.querySelector('.remove-menuiserie');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            item.remove();
            saveMenuiseries();
        });
    }
    
    item.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('change', saveMenuiseries);
        field.addEventListener('input', saveMenuiseries);
    });
}

// Sauvegarder les menuiseries
function saveMenuiseries() {
    const container = document.getElementById('menuiseriesList');
    if (!container) return;
    
    const items = container.querySelectorAll('.menuiserie-item');
    const menuiseries = [];
    
    items.forEach(item => {
        const inputs = item.querySelectorAll('input, textarea, select');
        const data = {};
        inputs.forEach((input, index) => {
            data[`field_${index}`] = input.value;
        });
        menuiseries.push(data);
    });
    
    localStorage.setItem('menuiseries', JSON.stringify(menuiseries));
}

// Générer le rapport
function generateReport() {
    const form = document.getElementById('quoteForm');
    if (!form) return;
    
    let html = '<html><head><meta charset="UTF-8"><title>Rapport Menuiserie</title>';
    html += '<style>';
    html += 'body { font-family: Arial, sans-serif; margin: 20px; }';
    html += 'h1 { color: #333; }';
    html += '.section { margin-bottom: 20px; page-break-inside: avoid; }';
    html += 'table { width: 100%; border-collapse: collapse; margin-top: 10px; }';
    html += 'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }';
    html += 'th { background-color: #4CAF50; color: white; }';
    html += '@media print { body { margin: 0; } }';
    html += '</style></head><body>';
    
    // Informations du devis
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea, select');
    html += '<h1>Devis Menuiserie</h1>';
    html += '<div class="section">';
    inputs.forEach(input => {
        if (input.value && input.parentElement.querySelector('label')) {
            const label = input.parentElement.querySelector('label').textContent;
            html += '<p><strong>' + label + ':</strong> ' + input.value + '</p>';
        }
    });
    html += '</div>';
    
    // Menuiseries
    const container = document.getElementById('menuiseriesList');
    if (container && container.querySelectorAll('.menuiserie-item').length > 0) {
        html += '<h2>Menuiseries</h2>';
        html += '<table><tr><th>Description</th><th>Largeur</th><th>Hauteur</th><th>Quantité</th><th>Coût Unitaire</th><th>Total</th></tr>';
        
        container.querySelectorAll('.menuiserie-item').forEach(item => {
            const fields = item.querySelectorAll('input, textarea, select');
            html += '<tr>';
            fields.forEach(field => {
                html += '<td>' + (field.value || '-') + '</td>';
            });
            html += '</tr>';
        });
        
        html += '</table>';
    }
    
    html += '</body></html>';
    
    const newWindow = window.open();
    newWindow.document.write(html);
    newWindow.document.close();
    setTimeout(() => newWindow.print(), 250);
}
