(() => {
  "use strict";

  // ========== ELEMENTS DOM ==========
  const formElements = {
    form: document.getElementById("quoteForm"),
    reference: document.getElementById("reference"),
    client: document.getElementById("client"),
    date: document.getElementById("date"),
    addMenuiserie: document.getElementById("addMenuiserie"),
    generatePdf: document.getElementById("generatePdf"),
    menuiseriesContainer: document.getElementById("menuiseriesContainer"),
    menuiserieModal: document.getElementById("menuiserieModal"),
    menuiserieForm: document.getElementById("menuiserieForm"),
    closeModal: document.getElementById("closeModal"),
    saveMenuiserie: document.getElementById("saveMenuiserie"),
  };

  // ========== INITIALISATION ==========
  if (!formElements.form) {
    console.error("Form not found");
    return;
  }

  let editingIndex = null;
  let menuiseries = [];

  // Charger les données du localStorage
  function loadData() {
    const saved = localStorage.getItem("quotationData");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        formElements.reference.value = data.reference || "";
        formElements.client.value = data.client || "";
        formElements.date.value = data.date || "";
        menuiseries = data.menuiseries || [];
        renderMenuiseries();
      } catch (e) {
        console.error("Erreur lors du chargement des données", e);
      }
    }
  }

  // Sauvegarder les données dans le localStorage
  function saveData() {
    const data = {
      reference: formElements.reference.value,
      client: formElements.client.value,
      date: formElements.date.value,
      menuiseries: menuiseries,
    };
    localStorage.setItem("quotationData", JSON.stringify(data));
  }

  // ========== GESTION MENUISERIES ==========
  function renderMenuiseries() {
    formElements.menuiseriesContainer.innerHTML = "";
    menuiseries.forEach((m, index) => {
      const card = document.createElement("div");
      card.className = "menuiserie-card";
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="margin: 0;">Menuiserie ${index + 1}</h4>
          <button type="button" class="delete-btn" data-index="${index}">✕ Supprimer</button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
          <div>
            <strong>Type :</strong> ${m.type || "—"}
          </div>
          <div>
            <strong>Modèle :</strong> ${m.modele || "—"}
          </div>
          <div>
            <strong>Largeur (mm) :</strong> ${m.largeur || "—"}
          </div>
          <div>
            <strong>Hauteur (mm) :</strong> ${m.hauteur || "—"}
          </div>
          <div>
            <strong>Position :</strong> ${m.position || "—"}
          </div>
          <div>
            <strong>Quantité :</strong> ${m.quantite || "1"}
          </div>
        </div>
        ${m.observation ? `<div style="margin-top: 8px; padding: 8px; background: #f5f5f5; border-radius: 4px;"><strong>Observation :</strong> ${m.observation}</div>` : ""}
        <button type="button" class="edit-btn" data-index="${index}" style="margin-top: 12px; padding: 6px 12px; background: #4a7c59; color: white; border: none; border-radius: 4px; cursor: pointer;">✎ Modifier</button>
      `;
      formElements.menuiseriesContainer.appendChild(card);
    });

    // Événements de suppression et édition
    formElements.menuiseriesContainer.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.target.dataset.index);
        menuiseries.splice(idx, 1);
        saveData();
        renderMenuiseries();
      });
    });

    formElements.menuiseriesContainer.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        editingIndex = parseInt(e.target.dataset.index);
        const m = menuiseries[editingIndex];
        document.getElementById("menuisery").value = m.type || "";
        document.getElementById("modele").value = m.modele || "";
        document.getElementById("pose").value = m.position || "";
        document.getElementById("width").value = m.largeur || "";
        document.getElementById("height").value = m.hauteur || "";
        document.getElementById("quantite").value = m.quantite || "1";
        document.getElementById("observation").value = m.observation || "";
        formElements.menuiserieModal.style.display = "block";
      });
    });

    updateMenuiserieCount();
  }

  function updateMenuiserieCount() {
    const badge = document.querySelector(".menu-count");
    if (badge) badge.textContent = menuiseries.length;
  }

  // ========== MODAL ==========
  if (formElements.addMenuiserie) {
    formElements.addMenuiserie.addEventListener("click", () => {
      editingIndex = null;
      formElements.menuiserieForm.reset();
      formElements.menuiserieModal.style.display = "block";
    });
  }

  if (formElements.closeModal) {
    formElements.closeModal.addEventListener("click", () => {
      formElements.menuiserieModal.style.display = "none";
      editingIndex = null;
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === formElements.menuiserieModal) {
      formElements.menuiserieModal.style.display = "none";
      editingIndex = null;
    }
  });

  if (formElements.saveMenuiserie) {
    formElements.saveMenuiserie.addEventListener("click", () => {
      const type = document.getElementById("menuisery").value.trim();
      const modele = document.getElementById("modele").value.trim();
      const position = document.getElementById("pose").value.trim();
      const largeur = document.getElementById("width").value.trim();
      const hauteur = document.getElementById("height").value.trim();
      const quantite = document.getElementById("quantite").value.trim() || "1";
      const observation = document.getElementById("observation").value.trim();

      if (!type || !largeur || !hauteur || !position) {
        alert("Veuillez remplir tous les champs obligatoires (Type, Largeur, Hauteur, Position).");
        return;
      }

      if (editingIndex !== null) {
        menuiseries[editingIndex] = {
          type,
          modele,
          position,
          largeur,
          hauteur,
          quantite,
          observation,
        };
      } else {
        menuiseries.push({
          type,
          modele,
          position,
          largeur,
          hauteur,
          quantite,
          observation,
        });
      }

      saveData();
      renderMenuiseries();
      formElements.menuiserieModal.style.display = "none";
      editingIndex = null;
    });
  }

  // ========== GENERATION PDF ==========
  if (formElements.generatePdf) {
    formElements.generatePdf.addEventListener("click", () => {
      if (typeof window.jspdf === "undefined" || !window.jspdf.jsPDF) {
        alert("jsPDF n'est pas chargé. Vérifiez votre connexion Internet.");
        return;
      }

      if (menuiseries.length === 0) {
        alert("Veuillez ajouter au moins une menuiserie avant de générer le PDF.");
        return;
      }

      const jsPDF = window.jspdf.jsPDF;
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      let yPosition = margin;

      const today = new Date();
      const dateStr = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${today.getFullYear()}`;

      // En-tête
      doc.setFontSize(18);
      doc.setFont(undefined, "bold");
      doc.text("COTATION MENUISERIE", margin, yPosition);
      yPosition += 10;

      // Infos générales
      doc.setFontSize(11);
      doc.setFont(undefined, "normal");
      doc.text(`Référence : ${formElements.reference.value || "—"}`, margin, yPosition);
      yPosition += 6;
      doc.text(`Client : ${formElements.client.value || "—"}`, margin, yPosition);
      yPosition += 6;
      doc.text(`Date du devis : ${formElements.date.value || dateStr}`, margin, yPosition);
      yPosition += 10;

      // Titre menuiseries
      doc.setFont(undefined, "bold");
      doc.text("MENUISERIES", margin, yPosition);
      yPosition += 8;

      // Détail des menuiseries
      doc.setFont(undefined, "normal");
      doc.setFontSize(10);

      menuiseries.forEach((m, idx) => {
        // Vérifier s'il faut créer une nouvelle page
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = margin;
        }

        // Titre menuiserie
        doc.setFont(undefined, "bold");
        doc.text(`Menuiserie ${idx + 1}`, margin, yPosition);
        yPosition += 6;

        // Détails
        doc.setFont(undefined, "normal");
        const details = [
          `Type : ${m.type || "—"}`,
          `Modèle : ${m.modele || "—"}`,
          `Largeur : ${m.largeur || "—"} mm`,
          `Hauteur : ${m.hauteur || "—"} mm`,
          `Position : ${m.position || "—"}`,
          `Quantité : ${m.quantite || "1"}`,
        ];

        details.forEach((detail) => {
          if (yPosition > pageHeight - 20) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(detail, margin + 5, yPosition);
          yPosition += 5;
        });

        if (m.observation) {
          if (yPosition > pageHeight - 20) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(`Observation : ${m.observation}`, margin + 5, yPosition);
          yPosition += 5;
        }

        yPosition += 5; // Espacement entre menuiseries
      });

      // Pied de page
      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text(`Page ${i}/${pageCount}`, pageWidth - margin - 20, pageHeight - 5);
      }

      // Télécharger
      const filename = `cotation-${formElements.client.value || "Client"}-${dateStr.replace(/\//g, "-")}.pdf`;
      doc.save(filename);
    });
  }

  // ========== AUTO-SAVE ==========
  formElements.form.addEventListener("change", saveData);

  // Charger au démarrage
  loadData();
})();
