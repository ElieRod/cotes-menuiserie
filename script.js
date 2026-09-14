// Récupérer tous les éléments du formulaire
const form = document.getElementById('cotationForm');
const clientNameInput = document.getElementById('clientName');
const clientEmailInput = document.getElementById('clientEmail');
const clientPhoneInput = document.getElementById('clientPhone');
const clientAddressInput = document.getElementById('clientAddress');
const menuiserieTypeSelect = document.getElementById('menuiserieType');
const poseTypeSelect = document.getElementById('poseType');
const largeurInput = document.getElementById('largeur');
const hauteurInput = document.getElementById('hauteur');
const materiauSelect = document.getElementById('materiau');
const vitrageSelect = document.getElementById('vitrage');
const couleurInput = document.getElementById('couleur');
const observationsInput = document.getElementById('observations');
const prixUnitaireInput = document.getElementById('prixUnitaire');
const quantiteInput = document.getElementById('quantite');
const generatePdfBtn = document.getElementById('generatePdfBtn');
const previewSection = document.getElementById('previewSection');
const schemaContainer = document.getElementById('schemaContainer');

// Initialiser l'app au chargement
document.addEventListener('DOMContentLoaded', () => {
  // Vérifier que tous les éléments existent
  if (!form || !generatePdfBtn) {
    console.error('Éléments du formulaire manquants');
    return;
  }
  
  // Ajouter les écouteurs d'événements
  generatePdfBtn.addEventListener('click', generateReport);
  menuiserieTypeSelect?.addEventListener('change', updatePoseTypes);
  
  // Initialiser les options de pose
  updatePoseTypes();
});

// Mettre à jour les types de pose selon la menuiserie
function updatePoseTypes() {
  const menuiserieType = menuiserieTypeSelect?.value || '';
  const poseTypes = {
    'fenetre': ['Applique', 'Tunnel', 'Feuillure', 'Rénovation'],
    'porte': ['Applique', 'Tunnel', 'Feuillure'],
    'baie-vitrée': ['Applique', 'Tunnel', 'Rénovation'],
    'velux': ['Applique', 'Tunnel'],
    'autre': ['Applique', 'Tunnel', 'Feuillure', 'Rénovation']
  };
  
  const options = poseTypes[menuiserieType] || poseTypes['autre'];
  poseTypeSelect.innerHTML = '<option value="">-- Sélectionner --</option>';
  options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option.toLowerCase();
    opt.textContent = option;
    poseTypeSelect.appendChild(opt);
  });
}

// Construire l'élément du rapport
function buildReportElement() {
  const clientName = clientNameInput?.value || 'Client';
  const clientEmail = clientEmailInput?.value || '';
  const clientPhone = clientPhoneInput?.value || '';
  const clientAddress = clientAddressInput?.value || '';
  const menuiserieType = menuiserieTypeSelect?.value || '';
  const poseType = poseTypeSelect?.value || '';
  const largeur = parseFloat(largeurInput?.value || 0);
  const hauteur = parseFloat(hauteurInput?.value || 0);
  const materiau = materiauSelect?.value || '';
  const vitrage = vitrageSelect?.value || '';
  const couleur = couleurInput?.value || '';
  const observations = observationsInput?.value || '';
  const prixUnitaire = parseFloat(prixUnitaireInput?.value || 0);
  const quantite = parseFloat(quantiteInput?.value || 1);
  const prixTotal = prixUnitaire * quantite;
  
  // Créer le conteneur du rapport
  const reportDiv = document.createElement('div');
  reportDiv.className = 'rapport-container';
  reportDiv.style.cssText = `
    font-family: Arial, sans-serif;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  `;
  
  // En-tête
  const header = document.createElement('div');
  header.style.cssText = `
    border-bottom: 3px solid #667eea;
    padding-bottom: 15px;
    margin-bottom: 20px;
  `;
  header.innerHTML = `
    <h1 style="margin: 0 0 10px 0; color: #333;">Rapport de Cotation</h1>
    <p style="margin: 5px 0; color: #666; font-size: 14px;">
      Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
    </p>
  `;
  reportDiv.appendChild(header);
  
  // Section client
  const clientSection = document.createElement('div');
  clientSection.style.cssText = `
    margin-bottom: 20px;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 5px;
  `;
  clientSection.innerHTML = `
    <h2 style="margin-top: 0; color: #333; font-size: 16px; border-bottom: 2px solid #667eea; padding-bottom: 8px;">
      📋 Informations Client
    </h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; width: 25%; font-weight: bold; color: #555;">Nom :</td>
        <td style="padding: 8px; color: #333;">${clientName}</td>
        <td style="padding: 8px; width: 25%; font-weight: bold; color: #555;">Email :</td>
        <td style="padding: 8px; color: #333;">${clientEmail}</td>
      </tr>
      <tr style="background: rgba(255,255,255,0.5);">
        <td style="padding: 8px; font-weight: bold; color: #555;">Téléphone :</td>
        <td style="padding: 8px; color: #333;">${clientPhone}</td>
        <td style="padding: 8px; font-weight: bold; color: #555;">Adresse :</td>
        <td style="padding: 8px; color: #333;">${clientAddress}</td>
      </tr>
    </table>
  `;
  reportDiv.appendChild(clientSection);
  
  // Section menuiserie
  const menuiserieSection = document.createElement('div');
  menuiserieSection.style.cssText = `
    margin-bottom: 20px;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 5px;
  `;
  menuiserieSection.innerHTML = `
    <h2 style="margin-top: 0; color: #333; font-size: 16px; border-bottom: 2px solid #667eea; padding-bottom: 8px;">
      🪟 Détails Menuiserie
    </h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; width: 25%; font-weight: bold; color: #555;">Type :</td>
        <td style="padding: 8px; color: #333;">${menuiserieType.toUpperCase() || 'N/A'}</td>
        <td style="padding: 8px; width: 25%; font-weight: bold; color: #555;">Type de Pose :</td>
        <td style="padding: 8px; color: #333;">${poseType.toUpperCase() || 'N/A'}</td>
      </tr>
      <tr style="background: rgba(255,255,255,0.5);">
        <td style="padding: 8px; font-weight: bold; color: #555;">Matériau :</td>
        <td style="padding: 8px; color: #333;">${materiau || 'N/A'}</td>
        <td style="padding: 8px; font-weight: bold; color: #555;">Vitrage :</td>
        <td style="padding: 8px; color: #333;">${vitrage || 'N/A'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold; color: #555;">Couleur :</td>
        <td style="padding: 8px; color: #333;">${couleur || 'N/A'}</td>
        <td style="padding: 8px; font-weight: bold; color: #555;"></td>
        <td style="padding: 8px;"></td>
      </tr>
    </table>
  `;
  reportDiv.appendChild(menuiserieSection);
  
  // Section schéma et dimensions
  const schemaSection = document.createElement('div');
  schemaSection.style.cssText = `
    margin-bottom: 20px;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 5px;
  `;
  
  const schemaSvg = createSchemaDrawing(largeur, hauteur, poseType);
  
  schemaSection.innerHTML = `
    <h2 style="margin-top: 0; color: #333; font-size: 16px; border-bottom: 2px solid #667eea; padding-bottom: 8px;">
      📐 Schéma et Dimensions
    </h2>
    <div style="text-align: center; margin: 15px 0;">
      <p style="font-size: 18px; color: #667eea; font-weight: bold; margin: 5px 0;">
        ${largeur} mm × ${hauteur} mm
      </p>
      <p style="color: #666; font-size: 12px; margin: 5px 0;">
        Pose : ${poseType.toUpperCase() || 'N/A'}
      </p>
    </div>
  `;
  
  // Ajouter le SVG au schéma
  const svgContainer = document.createElement('div');
  svgContainer.style.cssText = `
    border: 2px solid #667eea;
    border-radius: 5px;
    padding: 10px;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  svgContainer.appendChild(schemaSvg);
  schemaSection.appendChild(svgContainer);
  
  reportDiv.appendChild(schemaSection);
  
  // Section observations
  if (observations) {
    const obsSection = document.createElement('div');
    obsSection.style.cssText = `
      margin-bottom: 20px;
      padding: 15px;
      background: #fffbea;
      border-left: 4px solid #f59e0b;
      border-radius: 5px;
    `;
    obsSection.innerHTML = `
      <h2 style="margin-top: 0; color: #333; font-size: 16px;">📝 Observations</h2>
      <p style="margin: 0; color: #555; white-space: pre-wrap;">${observations}</p>
    `;
    reportDiv.appendChild(obsSection);
  }
  
  // Section tarification
  const pricingSection = document.createElement('div');
  pricingSection.style.cssText = `
    margin-bottom: 20px;
    padding: 15px;
    background: #f0fdf4;
    border-left: 4px solid #10b981;
    border-radius: 5px;
  `;
  pricingSection.innerHTML = `
    <h2 style="margin-top: 0; color: #333; font-size: 16px;">💰 Tarification</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; font-weight: bold; color: #555;">Prix Unitaire :</td>
        <td style="padding: 8px; text-align: right; color: #333;">${prixUnitaire.toFixed(2)} €</td>
      </tr>
      <tr style="background: rgba(255,255,255,0.5);">
        <td style="padding: 8px; font-weight: bold; color: #555;">Quantité :</td>
        <td style="padding: 8px; text-align: right; color: #333;">${quantite}</td>
      </tr>
      <tr style="background: #dcfce7; border-top: 2px solid #10b981;">
        <td style="padding: 12px; font-weight: bold; color: #059669; font-size: 16px;">TOTAL :</td>
        <td style="padding: 12px; text-align: right; color: #059669; font-weight: bold; font-size: 16px;">${prixTotal.toFixed(2)} €</td>
      </tr>
    </table>
  `;
  reportDiv.appendChild(pricingSection);
  
  // Pied de page
  const footer = document.createElement('div');
  footer.style.cssText = `
    border-top: 2px solid #e5e7eb;
    padding-top: 15px;
    margin-top: 20px;
    text-align: center;
    color: #999;
    font-size: 12px;
  `;
  footer.innerHTML = `
    <p style="margin: 5px 0;">Cet rapport a été généré automatiquement par l'application Cotation Menuiserie</p>
  `;
  reportDiv.appendChild(footer);
  
  return reportDiv;
}

// Créer le schéma SVG
function createSchemaDrawing(largeur, hauteur, poseType) {
  const svgWidth = 400;
  const svgHeight = 300;
  const scale = Math.min(
    (svgWidth - 40) / Math.max(largeur, 1),
    (svgHeight - 40) / Math.max(hauteur, 1)
  );
  const rectWidth = Math.max(largeur * scale, 50);
  const rectHeight = Math.max(hauteur * scale, 50);
  const offsetX = (svgWidth - rectWidth) / 2;
  const offsetY = (svgHeight - rectHeight) / 2;
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', svgWidth);
  svg.setAttribute('height', svgHeight);
  svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('style', 'border: 1px solid #ddd; background: #fafafa;');
  
  // Grille de fond
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
  pattern.setAttribute('id', 'grid');
  pattern.setAttribute('width', '20');
  pattern.setAttribute('height', '20');
  pattern.setAttribute('patternUnits', 'userSpaceOnUse');
  
  const pathGrid = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathGrid.setAttribute('d', 'M 20 0 L 0 0 0 20');
  pathGrid.setAttribute('fill', 'none');
  pathGrid.setAttribute('stroke', '#e5e7eb');
  pathGrid.setAttribute('stroke-width', '0.5');
  pattern.appendChild(pathGrid);
  defs.appendChild(pattern);
  svg.appendChild(defs);
  
  // Arrière-plan avec grille
  const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bgRect.setAttribute('width', svgWidth);
  bgRect.setAttribute('height', svgHeight);
  bgRect.setAttribute('fill', 'url(#grid)');
  svg.appendChild(bgRect);
  
  // Rectangle principal
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', offsetX);
  rect.setAttribute('y', offsetY);
  rect.setAttribute('width', rectWidth);
  rect.setAttribute('height', rectHeight);
  rect.setAttribute('fill', '#667eea');
  rect.setAttribute('stroke', '#4c51bf');
  rect.setAttribute('stroke-width', '2');
  rect.setAttribute('opacity', '0.7');
  svg.appendChild(rect);
  
  // Ajouter les cotations
  const dimensionTextX = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  dimensionTextX.setAttribute('x', offsetX + rectWidth / 2);
  dimensionTextX.setAttribute('y', offsetY + rectHeight + 25);
  dimensionTextX.setAttribute('text-anchor', 'middle');
  dimensionTextX.setAttribute('font-size', '14');
  dimensionTextX.setAttribute('font-weight', 'bold');
  dimensionTextX.setAttribute('fill', '#333');
  dimensionTextX.textContent = `${largeur}mm`;
  svg.appendChild(dimensionTextX);
  
  const dimensionTextY = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  dimensionTextY.setAttribute('x', offsetX - 20);
  dimensionTextY.setAttribute('y', offsetY + rectHeight / 2);
  dimensionTextY.setAttribute('text-anchor', 'end');
  dimensionTextY.setAttribute('font-size', '14');
  dimensionTextY.setAttribute('font-weight', 'bold');
  dimensionTextY.setAttribute('fill', '#333');
  dimensionTextY.setAttribute('transform', `rotate(-90, ${offsetX - 20}, ${offsetY + rectHeight / 2})`);
  dimensionTextY.textContent = `${hauteur}mm`;
  svg.appendChild(dimensionTextY);
  
  // Type de pose
  const poseText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  poseText.setAttribute('x', svgWidth / 2);
  poseText.setAttribute('y', 20);
  poseText.setAttribute('text-anchor', 'middle');
  poseText.setAttribute('font-size', '12');
  poseText.setAttribute('fill', '#666');
  poseText.textContent = `Pose: ${poseType.toUpperCase() || 'N/A'}`;
  svg.appendChild(poseText);
  
  return svg;
}

// Afficher l'aperçu
function showReportPreview(element) {
  if (!schemaContainer || !previewSection) {
    console.warn('Conteneurs d\'aperçu manquants');
    return;
  }
  
  // Vider et insérer
  schemaContainer.innerHTML = '';
  schemaContainer.appendChild(element);
  
  // Afficher la section d'aperçu
  previewSection.style.display = 'block';
  
  // Scroller vers l'aperçu
  setTimeout(() => {
    previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// Générer le rapport (principal)
function generateReport() {
  try {
    // Valider les champs obligatoires
    if (!largeurInput?.value || !hauteurInput?.value) {
      alert('⚠️ Veuillez remplir les dimensions (largeur et hauteur)');
      return;
    }
    
    // Construire le rapport
    const reportElement = buildReportElement();
    
    // Afficher l'aperçu
    showReportPreview(reportElement);
    
    // Générer le PDF
    generatePDF(reportElement);
    
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    alert('❌ Erreur: ' + error.message);
  }
}

// Générer et télécharger le PDF
function generatePDF(reportElement) {
  try {
    // Vérifier que html2pdf est disponible
    if (typeof html2pdf === 'undefined') {
      console.warn('html2pdf non disponible, utilisation du fallback');
      window.print();
      return;
    }
    
    const opt = {
      margin: 10,
      filename: `cotation_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(opt).from(reportElement).save();
    
  } catch (error) {
    console.error('Erreur PDF:', error);
    // Fallback: ouvrir l'impression
    window.print();
  }
}

// Alias pour compatibilité
window.generatePDF = generatePDF;
