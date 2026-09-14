// ============================================================
// COTATION MENUISERIES - APP.JS (corrigé)
// Aligné sur les IDs/éléments réellement présents dans index.html
// #addMenuiserie, #generatePdf
// - Un seul formulaire de menuiserie à la fois
// - Dimensions en mm
// - Au chargement : chargement des schémas SVG depuis assets/schemas/
// - Aperçu rapport à l'écran + génération PDF (jsPDF + html2canvas)
// - Pas de carré violet, pas de tarification, pas de liste infinie
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('✓ DOM chargé - initialisation app.js');

  // ========== ÉLÉMENTS DOM ==========
  const formElements = {
    client: document.getElementById('client'),
    adresseChantier: document.getElementById('adresseChantier'),
    codePostal: document.getElementById('codePostal'),
    ville: document.getElementById('ville'),
    telephone: document.getElementById('telephone'),
    email: document.getElementById('email'),
    dateVisite: document.getElementById('dateVisite'),
    observation: document.getElementById('observation'),
    menuiserieType: document.getElementById('menuiserieType'),
    menuiserieModel: document.getElementById('menuiserieModel'),
    menuiserieQuantite: document.getElementById('menuiserieQuantite'),
    menuiseriePosition: document.getElementById('menuiseriePosition'),
    menuiserieLargeur: document.getElementById('menuiserieLargeur'),
    menuiserieHauteur: document.getElementById('menuiserieHauteur'),
    addMenuiserie: document.getElementById('addMenuiserie'),
    generatePdf: document.getElementById('generatePdf'),
    previewReport: document.getElementById('previewReport'),
    menuiserieContainer: document.getElementById('menuiserieContainer'),
    schemaContainer: document.getElementById('schemaContainer')
  };

  // Vérification éléments critiques
  const criticalElements = ['addMenuiserie', 'generatePdf', 'menuiserieContainer', 'schemaContainer'];
  for (const elem of criticalElements) {
    if (!formElements[elem]) {
      console.error(`❌ ERREUR CRITIQUE : élément #${elem} introuvable dans le DOM`);
      alert(`Erreur : élément HTML manquant (#${elem}). Contacte le développeur.`);
      return;
    }
  }

  console.log('✓ Tous les éléments DOM trouvés');

  // ========== STATE ==========
  let menuiseries = [];
  let schemas = {};

  // ========== CHARGEMENT DES SCHEMAS SVG ==========
  async function loadSchemas() {
    console.log('📦 Chargement des schémas SVG...');
    const schemaTypes = ['fenetre', 'porte', 'baie-coulissante', 'verriere'];
    
    for (const type of schemaTypes) {
      try {
        const response = await fetch(`assets/schemas/${type}.svg`);
        if (response.ok) {
          schemas[type] = await response.text();
          console.log(`✓ Schéma chargé : ${type}`);
        } else {
          console.warn(`⚠ Schéma non trouvé : ${type} (HTTP ${response.status})`);
          schemas[type] = `<svg width="200" height="200"><text x="10" y="100" font-size="12">Schéma ${type} indisponible</text></svg>`;
        }
      } catch (error) {
        console.warn(`⚠ Erreur chargement schéma ${type}:`, error);
        schemas[type] = `<svg width="200" height="200"><text x="10" y="100" font-size="12">Erreur ${type}</text></svg>`;
      }
    }
  }

  // ========== AFFICHAGE SCHEMA ==========
  function updateSchema() {
    const type = formElements.menuiserieType?.value || 'fenetre';
    const container = formElements.schemaContainer;
    if (!container) return;

    const schemaSvg = schemas[type] || schemas['fenetre'];
    container.innerHTML = schemaSvg;
    console.log(`✓ Schéma affiché : ${type}`);
  }

  formElements.menuiserieType?.addEventListener('change', updateSchema);

  // ========== AJOUTER MENUISERIE (une seule à la fois) ==========
  formElements.addMenuiserie?.addEventListener('click', function() {
    // Validation
    if (!formElements.menuiserieType?.value) {
      alert('❌ Sélectionne un type de menuiserie');
      return;
    }
    if (!formElements.menuiserieQuantite?.value || isNaN(formElements.menuiserieQuantite.value) || formElements.menuiserieQuantite.value <= 0) {
      alert('❌ Quantité invalide');
      return;
    }
    if (!formElements.menuiserieLargeur?.value || isNaN(formElements.menuiserieLargeur.value) || formElements.menuiserieLargeur.value <= 0) {
      alert('❌ Largeur invalide (mm)');
      return;
    }
    if (!formElements.menuiserieHauteur?.value || isNaN(formElements.menuiserieHauteur.value) || formElements.menuiserieHauteur.value <= 0) {
      alert('❌ Hauteur invalide (mm)');
      return;
    }
    if (!formElements.menuiseriePosition?.value) {
      alert('❌ Sélectionne un type de pose');
      return;
    }

    // Remplacer la menuiserie précédente (une seule à la fois)
    menuiseries = [{
      type: formElements.menuiserieType.value,
      model: formElements.menuiserieModel?.value || 'Standard',
      quantite: parseInt(formElements.menuiserieQuantite.value),
      position: formElements.menuiseriePosition.value,
      largeur: parseFloat(formElements.menuiserieLargeur.value),
      hauteur: parseFloat(formElements.menuiserieHauteur.value)
    }];

    console.log('✓ Menuiserie ajoutée :', menuiseries[0]);
    afficherMenuiseries();
  });

  // ========== AFFICHAGE MENUISERIES ==========
  function afficherMenuiseries() {
    const container = formElements.menuiserieContainer;
    if (!container) return;

    if (menuiseries.length === 0) {
      container.innerHTML = '<p style="color: #999;">Aucune menuiserie ajoutée</p>';
      return;
    }

    container.innerHTML = menuiseries.map((m, idx) => `
      <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 4px; background: #f9f9f9;">
        <strong>${m.type}</strong> - ${m.quantite}x (${m.largeur}×${m.hauteur} mm)
        <br><small>Modèle: ${m.model} | Pose: ${m.position}</small>
        <button onclick="window.removeMenuiserie(${idx})" style="float: right; padding: 4px 8px; background: #ff6b6b; color: white; border: none; border-radius: 3px; cursor: pointer;">Supprimer</button>
      </div>
    `).join('');
  }

  window.removeMenuiserie = function(idx) {
    menuiseries.splice(idx, 1);
    afficherMenuiseries();
  };

  // ========== GENERER RAPPORT ==========
  function generateReport() {
    console.log('📋 Génération du rapport...');

    // Vérifications
    if (!formElements.client?.value) {
      alert('❌ Remplis le nom du client');
      return null;
    }
    if (!formElements.adresseChantier?.value) {
      alert('❌ Remplis l\'adresse du chantier');
      return null;
    }
    if (menuiseries.length === 0) {
      alert('❌ Ajoute au moins une menuiserie');
      return null;
    }

    const reportContent = `
      <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; color: #333;">RAPPORT DE COTATION</h1>
        <hr style="border: none; border-top: 2px solid #333; margin: 20px 0;">

        <h3 style="color: #555;">📍 CLIENT</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Nom:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(formElements.client.value)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Adresse:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(formElements.adresseChantier.value)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Code postal:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(formElements.codePostal.value || '-')}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Ville:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(formElements.ville.value || '-')}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Téléphone:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(formElements.telephone.value || '-')}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(formElements.email.value || '-')}</td>
          </tr>
        </table>

        <h3 style="color: #555;">📅 INFORMATIONS</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Date visite:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(formElements.dateVisite.value || '-')}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; vertical-align: top;"><strong>Observations:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(formElements.observation.value || '-').replace(/\n/g, '<br>')}</td>
          </tr>
        </table>

        <h3 style="color: #555;">🪟 MENUISERIES</h3>
        ${menuiseries.map((m, idx) => `
          <div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 4px; background: #f5f5f5;">
            <h4 style="margin: 0 0 10px 0; color: #333;">Menuiserie ${idx + 1}</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px; border-bottom: 1px solid #ddd; width: 30%;"><strong>Type:</strong></td>
                <td style="padding: 6px; border-bottom: 1px solid #ddd;">${escapeHtml(m.type)}</td>
              </tr>
              <tr>
                <td style="padding: 6px; border-bottom: 1px solid #ddd;"><strong>Modèle:</strong></td>
                <td style="padding: 6px; border-bottom: 1px solid #ddd;">${escapeHtml(m.model)}</td>
              </tr>
              <tr>
                <td style="padding: 6px; border-bottom: 1px solid #ddd;"><strong>Quantité:</strong></td>
                <td style="padding: 6px; border-bottom: 1px solid #ddd;">${m.quantite}</td>
              </tr>
              <tr>
                <td style="padding: 6px; border-bottom: 1px solid #ddd;"><strong>Type de pose:</strong></td>
                <td style="padding: 6px; border-bottom: 1px solid #ddd;">${escapeHtml(m.position)}</td>
              </tr>
              <tr>
                <td style="padding: 6px; border-bottom: 1px solid #ddd;"><strong>Dimensions (mm):</strong></td>
                <td style="padding: 6px; border-bottom: 1px solid #ddd;">${m.largeur} × ${m.hauteur}</td>
              </tr>
            </table>
          </div>
        `).join('')}

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="text-align: center; color: #999; font-size: 12px;">
          Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
        </p>
      </div>
    `;

    return reportContent;
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

  // ========== APERCU RAPPORT ==========
  formElements.previewReport?.addEventListener('click', function() {
    const report = generateReport();
    if (report) {
      const modal = document.createElement('div');
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';
      modal.innerHTML = `
        <div style="background: white; width: 90%; max-width: 900px; max-height: 80vh; overflow-y: auto; border-radius: 8px; padding: 20px;">
          <button onclick="this.closest('div').style.display='none'" style="float: right; padding: 8px 12px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">Fermer</button>
          ${report}
        </div>
      `;
      document.body.appendChild(modal);
      console.log('✓ Aperçu rapport affiché');
    }
  });

  // ========== GENERER PDF ==========
  formElements.generatePdf?.addEventListener('click', async function() {
    console.log('📄 Génération PDF...');

    const report = generateReport();
    if (!report) {
      console.error('❌ Rapport vide - PDF non généré');
      return;
    }

    try {
      // Créer conteneur temporaire
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = report;
      tempContainer.style.cssText = 'position: fixed; left: -10000px; top: -10000px; width: 900px; background: white;';
      document.body.appendChild(tempContainer);

      // Attendre le rendu DOM
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capturer avec html2canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      // Créer PDF avec jsPDF
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let yPos = 10;
      let remainingHeight = imgHeight;
      let page = 1;

      while (remainingHeight > 0) {
        const canvasHeight = Math.min(remainingHeight, pageHeight - 20);
        const srcY = (imgHeight - remainingHeight) * (canvas.height / imgHeight);
        const srcHeight = canvasHeight * (canvas.height / imgHeight);

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = srcHeight;
        const ctx = pageCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, srcY, canvas.width, srcHeight, 0, 0, canvas.width, srcHeight);
        const pageImgData = pageCanvas.toDataURL('image/png');

        if (page > 1) pdf.addPage();
        pdf.addImage(pageImgData, 'PNG', 10, 10, imgWidth, canvasHeight);

        remainingHeight -= canvasHeight;
        page++;
      }

      // Télécharger
      pdf.save(`cotation_${formElements.client.value.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
      console.log('✓ PDF généré et téléchargé');
      alert('✅ PDF généré avec succès !');

      // Nettoyage
      document.body.removeChild(tempContainer);

    } catch (error) {
      console.error('❌ Erreur génération PDF:', error);
      alert(`❌ Erreur: ${error.message}`);
    }
  });

  // ========== INITIALISATION ==========
  console.log('✓ Événements liés');
  loadSchemas().then(() => {
    updateSchema();
    console.log('✓ App.js initialisé avec succès');
  });
});
