// État global de l'application
let reperes = [];
let repereCounter = 1;

// Types de vitrages disponibles
const VITRAGE_TYPES = [
    'Vitrage dépoli',
    'Vitrage fixe sécurité',
    'Vitrage fixe',
    'Plein',
    'Double vitrage',
    'Triple vitrage',
    'Autre'
];

// Types de menuiseries
const MENUISERIE_TYPES = [
    'Fenêtre 1 vantail',
    'Fenêtre 2 vantaux',
    'Fenêtre 3 vantaux',
    'Porte-fenêtre 1 vantail',
    'Porte-fenêtre 2 vantaux',
    'Châssis fixe',
    'Coulissant',
    'Autre'
];

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('date').valueAsDate = new Date();
    
    document.getElementById('addRepereBtn').addEventListener('click', addRepere);
    document.getElementById('previewBtn').addEventListener('click', generatePreview);
    document.getElementById('generatePdfBtn').addEventListener('click', generatePDF);
    document.getElementById('closePreviewBtn').addEventListener('click', closePreview);
    
    // Ajouter 1 repère par défaut
    addRepere();
});

function addRepere() {
    const repere = {
        id: repereCounter++,
        numero: reperes.length + 1,
        type: 'Fenêtre 1 vantail',
        largeur: '',
        hauteur: '',
        coteBati: '',
        vitrage: 'Vitrage fixe',
        reference: '',
        notes: ''
    };
    
    reperes.push(repere);
    renderRepere(repere);
}

function renderRepere(repere) {
    const container = document.getElementById('reperesToabs');
    
    const card = document.createElement('div');
    card.className = 'repere-card';
    card.id = `repere-${repere.id}`;
    
    card.innerHTML = `
        <div class="repere-header">
            <h3>Repère ${repere.numero}</h3>
            <button class="btn-remove" onclick="removeRepere(${repere.id})">Supprimer</button>
        </div>
        
        <div class="repere-fields">
            <div class="form-group">
                <label>Type de menuiserie :</label>
                <select onchange="updateRepere(${repere.id}, 'type', this.value)">
                    ${MENUISERIE_TYPES.map(t => `<option value="${t}" ${t === repere.type ? 'selected' : ''}>${t}</option>`).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label>Largeur (mm) :</label>
                <input type="number" placeholder="Ex: 1500" value="${repere.largeur}" onchange="updateRepere(${repere.id}, 'largeur', this.value)">
            </div>
            
            <div class="form-group">
                <label>Hauteur (mm) :</label>
                <input type="number" placeholder="Ex: 1200" value="${repere.hauteur}" onchange="updateRepere(${repere.id}, 'hauteur', this.value)">
            </div>
            
            <div class="form-group">
                <label>Cote Bâti (mm) :</label>
                <input type="number" placeholder="Ex: 1180" value="${repere.coteBati}" onchange="updateRepere(${repere.id}, 'coteBati', this.value)">
            </div>
            
            <div class="form-group">
                <label>Type de vitrage :</label>
                <select onchange="updateRepere(${repere.id}, 'vitrage', this.value)">
                    ${VITRAGE_TYPES.map(v => `<option value="${v}" ${v === repere.vitrage ? 'selected' : ''}>${v}</option>`).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label>Référence panneau :</label>
                <input type="text" placeholder="Ex: SASHA 1" value="${repere.reference}" onchange="updateRepere(${repere.id}, 'reference', this.value)">
            </div>
            
            <div class="form-group" style="grid-column: 1 / -1;">
                <label>Notes :</label>
                <input type="text" placeholder="Infos supplémentaires" value="${repere.notes}" onchange="updateRepere(${repere.id}, 'notes', this.value)">
            </div>
        </div>
    `;
    
    container.appendChild(card);
}

function updateRepere(id, field, value) {
    const repere = reperes.find(r => r.id === id);
    if (repere) {
        repere[field] = value;
    }
}

function removeRepere(id) {
    reperes = reperes.filter(r => r.id !== id);
    document.getElementById(`repere-${id}`).remove();
    
    // Renumeroter les repères
    reperes.forEach((r, i) => {
        r.numero = i + 1;
    });
}

function generatePreview() {
    const container = document.getElementById('schemaContainer');
    container.innerHTML = '';
    
    // Créer un conteneur pour tous les schémas
    const allSchemas = document.createElement('div');
    allSchemas.style.width = '100%';
    
    reperes.forEach((repere, index) => {
        const svg = createRepereSchema(repere);
        
        const schemaWrapper = document.createElement('div');
        schemaWrapper.style.marginBottom = '30px';
        schemaWrapper.style.pageBreakAfter = 'always';
        schemaWrapper.innerHTML = `
            <h3 style="text-align: center; margin-bottom: 15px; color: #2c3e50;">Repère ${repere.numero}</h3>
        `;
        schemaWrapper.appendChild(svg);
        
        // Ajouter les infos sous le schéma
        const infos = document.createElement('div');
        infos.style.marginTop = '15px';
        infos.innerHTML = `
            <p><strong>Type :</strong> ${repere.type}</p>
            <p><strong>Vitrage :</strong> ${repere.vitrage}</p>
            ${repere.reference ? `<p><strong>Référence :</strong> ${repere.reference}</p>` : ''}
            ${repere.notes ? `<p><strong>Notes :</strong> ${repere.notes}</p>` : ''}
        `;
        schemaWrapper.appendChild(infos);
        
        allSchemas.appendChild(schemaWrapper);
    });
    
    container.appendChild(allSchemas);
    document.getElementById('previewSection').style.display = 'block';
    document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth' });
}

function createRepereSchema(repere) {
    const width = 600;
    const height = 500;
    const padding = 80;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.maxWidth = '100%';
    
    // Fond blanc
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', 'white');
    svg.appendChild(bg);
    
    const x1 = padding;
    const y1 = padding;
    const x2 = width - padding;
    const y2 = height - padding;
    
    // Rectangle principal (menuiserie)
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x1);
    rect.setAttribute('y', y1);
    rect.setAttribute('width', x2 - x1);
    rect.setAttribute('height', y2 - y1);
    rect.setAttribute('fill', '#e8f4f8');
    rect.setAttribute('stroke', '#2c3e50');
    rect.setAttribute('stroke-width', '2');
    svg.appendChild(rect);
    
    // Numéro de repère au centre
    const numeroText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    numeroText.setAttribute('x', (x1 + x2) / 2);
    numeroText.setAttribute('y', (y1 + y2) / 2);
    numeroText.setAttribute('text-anchor', 'middle');
    numeroText.setAttribute('dominant-baseline', 'middle');
    numeroText.setAttribute('font-size', '48');
    numeroText.setAttribute('font-weight', 'bold');
    numeroText.setAttribute('fill', '#3498db');
    numeroText.setAttribute('opacity', '0.3');
    numeroText.textContent = repere.numero;
    svg.appendChild(numeroText);
    
    // Type de vitrage (pattern simple)
    if (repere.vitrage.includes('dépoli')) {
        drawHatchPattern(svg, x1 + 20, y1 + 20, x2 - x1 - 40, y2 - y1 - 40);
    }
    
    // Dimensions - Largeur (bas)
    if (repere.largeur) {
        addDimension(svg, x1, y2 + 20, x2, y2 + 20, `L: ${repere.largeur} mm`, 'bottom');
    }
    
    // Dimensions - Hauteur (droite)
    if (repere.hauteur) {
        addDimension(svg, x2 + 20, y1, x2 + 20, y2, `H: ${repere.hauteur} mm`, 'right');
    }
    
    // Cote Bâti (gauche)
    if (repere.coteBati) {
        addDimension(svg, x1 - 20, y1, x1 - 20, y2, `CB: ${repere.coteBati} mm`, 'left');
    }
    
    // Texte vitrage
    const vitrageText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    vitrageText.setAttribute('x', (x1 + x2) / 2);
    vitrageText.setAttribute('y', height - 30);
    vitrageText.setAttribute('text-anchor', 'middle');
    vitrageText.setAttribute('font-size', '12');
    vitrageText.setAttribute('fill', '#2c3e50');
    vitrageText.setAttribute('font-weight', 'bold');
    vitrageText.textContent = repere.vitrage;
    svg.appendChild(vitrageText);
    
    return svg;
}

function drawHatchPattern(svg, x, y, width, height) {
    // Pattern de hachures pour vitrage dépoli
    for (let i = 0; i < width; i += 8) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x + i);
        line.setAttribute('y1', y);
        line.setAttribute('x2', x + i);
        line.setAttribute('y2', y + height);
        line.setAttribute('stroke', '#bdc3c7');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
    }
}

function addDimension(svg, x1, y1, x2, y2, text, position) {
    // Ligne de cote
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#2c3e50');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
    
    // Texte dimension
    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textEl.setAttribute('font-size', '11');
    textEl.setAttribute('fill', '#2c3e50');
    textEl.setAttribute('font-weight', 'bold');
    
    if (position === 'bottom') {
        textEl.setAttribute('x', (x1 + x2) / 2);
        textEl.setAttribute('y', y1 + 15);
        textEl.setAttribute('text-anchor', 'middle');
    } else if (position === 'right') {
        textEl.setAttribute('x', x1 + 8);
        textEl.setAttribute('y', (y1 + y2) / 2);
        textEl.setAttribute('dominant-baseline', 'middle');
    } else if (position === 'left') {
        textEl.setAttribute('x', x1 - 8);
        textEl.setAttribute('y', (y1 + y2) / 2);
        textEl.setAttribute('text-anchor', 'end');
        textEl.setAttribute('dominant-baseline', 'middle');
    }
    
    textEl.textContent = text;
    svg.appendChild(textEl);
}

function generatePDF() {
    const clientName = document.getElementById('clientName').value;
    const reference = document.getElementById('reference').value;
    const date = document.getElementById('date').value;
    const bicoloration = document.getElementById('bicoloration').value;
    
    if (reperes.length === 0 || !reperes.some(r => r.largeur || r.hauteur)) {
        alert('Veuillez ajouter au moins un repère avec des dimensions.');
        return;
    }
    
    // Créer le document PDF
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.fontSize = '12px';
    
    // Entête
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.marginBottom = '30px';
    header.style.borderBottom = '2px solid #333';
    header.style.paddingBottom = '20px';
    header.innerHTML = `
        <h1 style="margin: 0; color: #2c3e50;">RAPPORT DE COTES MENUISERIE</h1>
        <p style="margin: 10px 0 0 0; color: #7f8c8d;">${new Date().toLocaleDateString('fr-FR')}</p>
    `;
    element.appendChild(header);
    
    // Informations client
    const infos = document.createElement('div');
    infos.style.marginBottom = '30px';
    infos.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px; width: 50%;"><strong>Client :</strong> ${clientName}</td>
                <td style="padding: 8px; width: 50%;"><strong>Référence :</strong> ${reference}</td>
            </tr>
            <tr>
                <td style="padding: 8px; width: 50%;"><strong>Date :</strong> ${date}</td>
                <td style="padding: 8px; width: 50%;"><strong>Bicoloration :</strong> ${bicoloration}</td>
            </tr>
        </table>
    `;
    element.appendChild(infos);
    
    // Schémas
    reperes.forEach((repere, index) => {
        const page = document.createElement('div');
        page.style.pageBreakAfter = 'always';
        page.style.marginTop = index > 0 ? '40px' : '0';
        
        const title = document.createElement('h2');
        title.style.color = '#2c3e50';
        title.style.marginBottom = '20px';
        title.textContent = `Repère ${repere.numero}`;
        page.appendChild(title);
        
        // SVG du schéma
        const svg = createRepereSchema(repere);
        svg.setAttribute('style', 'max-width: 100%; margin-bottom: 20px;');
        page.appendChild(svg);
        
        // Infos du repère
        const repereInfos = document.createElement('div');
        repereInfos.style.marginTop = '20px';
        repereInfos.innerHTML = `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr style="background: #ecf0f1;">
                    <td style="padding: 8px; font-weight: bold;">Type</td>
                    <td style="padding: 8px;">${repere.type}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Dimensions (mm)</td>
                    <td style="padding: 8px;">L: ${repere.largeur || '-'} × H: ${repere.hauteur || '-'}</td>
                </tr>
                <tr style="background: #ecf0f1;">
                    <td style="padding: 8px; font-weight: bold;">Cote Bâti</td>
                    <td style="padding: 8px;">${repere.coteBati || '-'} mm</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Vitrage</td>
                    <td style="padding: 8px;">${repere.vitrage}</td>
                </tr>
                ${repere.reference ? `
                <tr style="background: #ecf0f1;">
                    <td style="padding: 8px; font-weight: bold;">Référence</td>
                    <td style="padding: 8px;">${repere.reference}</td>
                </tr>
                ` : ''}
                ${repere.notes ? `
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Notes</td>
                    <td style="padding: 8px;">${repere.notes}</td>
                </tr>
                ` : ''}
            </table>
        `;
        page.appendChild(repereInfos);
        
        element.appendChild(page);
    });
    
    // Générer le PDF
    const opt = {
        margin: 10,
        filename: `cotes-menuiserie-${reference || 'rapport'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(opt).from(element).save();
}

function closePreview() {
    document.getElementById('previewSection').style.display = 'none';
}
