(() => {
  "use strict";

  const form = document.getElementById("quoteForm");
  const list = document.getElementById("menuiseriesList");
  const template = document.getElementById("menuiserieTemplate");
  const addBtn = document.getElementById("addMenuiserie");
  const pdfBtn = document.getElementById("generatePdf");
  const countDisplay = document.getElementById("menuiseriesCount");

  let menuiserieCount = 0;

  // Ajouter une menuiserie
  if (addBtn) {
    addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addMenuiserie();
    });
  }

  function addMenuiserie() {
    if (!template || !list) return;

    const clone = template.content.cloneNode(true);
    const id = Date.now();

    // Ajouter un ID unique au conteneur de la menuiserie
    const container = clone.querySelector(".menuiserie-item");
    if (container) {
      container.id = `menuiserie-${id}`;
    }

    // Bouton de suppression
    const removeBtn = clone.querySelector(".remove-menuiserie");
    if (removeBtn) {
      removeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById(`menuiserie-${id}`).remove();
        menuiserieCount--;
        updateCount();
      });
    }

    list.appendChild(clone);
    menuiserieCount++;
    updateCount();
  }

  function updateCount() {
    if (countDisplay) {
      countDisplay.textContent = menuiserieCount;
    }
  }

  // Générer le PDF
  if (pdfBtn) {
    pdfBtn.addEventListener("click", (e) => {
      e.preventDefault();
      generatePDF();
    });
  }

  function generatePDF() {
    // Vérifier que jsPDF est chargé
    if (typeof jspdf === "undefined" || !jspdf.jsPDF) {
      alert("Erreur : jsPDF n'est pas chargé.");
      return;
    }

    const { jsPDF } = jspdf;

    // Récupérer les données du formulaire
    const referenceDevis = document.querySelector("input[placeholder*='DEV']")?.value || "DEV-2026-001";
    const nomClient = document.querySelector("input[placeholder*='Nom du client']")?.value || "Client";
    const dateRapport = document.querySelector("input[type='date']")?.value || new Date().toISOString().split("T")[0];

    // Créer le document PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = margin;

    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(49, 88, 82); // Vert foncé
    doc.text("Rapport de Cotation", margin, y);
    y += 15;

    // Informations générales
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Référence : ${referenceDevis}`, margin, y);
    y += 8;
    doc.text(`Client : ${nomClient}`, margin, y);
    y += 8;
    doc.text(`Date : ${dateRapport}`, margin, y);
    y += 12;

    // Détail des menuiseries
    const menuiseries = document.querySelectorAll(".menuiserie-item");
    
    if (menuiseries.length === 0) {
      doc.setFontSize(11);
      doc.setTextColor(150, 150, 150);
      doc.text("Aucune menuiserie ajoutée.", margin, y);
      y += 8;
    } else {
      doc.setFontSize(13);
      doc.setTextColor(49, 88, 82);
      doc.text("Détail des Menuiseries", margin, y);
      y += 10;

      menuiseries.forEach((menuiserie, index) => {
        // Fond de section
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(margin, y - 5, pageWidth - margin * 2, 50, 2, 2, "FD");

        // Numéro de menuiserie
        doc.setFontSize(11);
        doc.setTextColor(49, 88, 82);
        doc.text(`Menuiserie ${index + 1}`, margin + 5, y + 2);

        y += 8;

        // Extraire les données
        const type = menuiserie.querySelector(".type-menuiserie")?.value || "Non spécifié";
        const largeur = menuiserie.querySelector(".largeur")?.value || "-";
        const hauteur = menuiserie.querySelector(".hauteur")?.value || "-";
        const vitrage = menuiserie.querySelector(".vitrage")?.value || "Non spécifié";
        const teintes = menuiserie.querySelector(".teintes")?.value || "Non spécifié";
        const remarques = menuiserie.querySelector(".remarques")?.value || "-";

        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);

        doc.text(`Type : ${type}`, margin + 5, y);
        y += 6;
        doc.text(`Dimensions : ${largeur} mm × ${hauteur} mm`, margin + 5, y);
        y += 6;
        doc.text(`Vitrage : ${vitrage}`, margin + 5, y);
        y += 6;
        doc.text(`Teintes : ${teintes}`, margin + 5, y);
        y += 6;
        doc.text(`Remarques : ${remarques}`, margin + 5, y);
        y += 12;

        // Vérifier si on doit ajouter une nouvelle page
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      });
    }

    // Pied de page
    y = pageHeight - 10;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, margin, y);

    // Télécharger
    const filename = `cotation-${nomClient.replace(/\s+/g, "-")}-${dateRapport}.pdf`;
    doc.save(filename);
  }

  // Initialiser le compteur au chargement
  updateCount();
})();
