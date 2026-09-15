(() => {
  "use strict";

  const form = document.getElementById("quoteForm");
  const list = document.getElementById("menuiseriesList");
  const template = document.getElementById("menuiserieTemplate");
  const addButton = document.getElementById("addMenuiserie");
  const count = document.getElementById("itemCount");
  const feedback = document.getElementById("formFeedback");

  let feedbackTimer;

  const today = new Date();
  const dateInput = document.getElementById("quoteDate");

  dateInput.value = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 10);

  function showFeedback(message, kind = "") {
    feedback.textContent = message;
    feedback.className = `form-feedback ${kind}`.trim();

    clearTimeout(feedbackTimer);

    if (message) {
      feedbackTimer = setTimeout(() => {
        feedback.textContent = "";
        feedback.className = "form-feedback";
      }, 5000);
    }
  }

  function refreshItems() {
    const items = [...list.querySelectorAll(".menuiserie-card")];

    count.textContent = items.length;

    items.forEach((item, index) => {
      item.querySelector(".item-index").textContent = String(index + 1).padStart(
        2,
        "0"
      );
    });
  }

  function addMenuiserie() {
    const fragment = template.content.cloneNode(true);
    const item = fragment.querySelector(".menuiserie-card");

    item.querySelector(".remove-item").addEventListener("click", () => {
      item.remove();
      refreshItems();
    });

    list.appendChild(fragment);
    refreshItems();

    item.querySelector('select[name="type"]').focus();
  }

  function value(item, name) {
    return item.querySelector(`[name="${name}"]`).value.trim();
  }

  function collectData() {
    return {
      reference: document.getElementById("quoteReference").value.trim(),
      client: document.getElementById("clientName").value.trim(),
      date: document.getElementById("quoteDate").value,

      items: [...list.querySelectorAll(".menuiserie-card")].map((item) => ({
        type: value(item, "type"),
        model: value(item, "model"),
        width: value(item, "width"),
        height: value(item, "height"),
        position: value(item, "position"),
        quantity: value(item, "quantity"),
        observation: value(item, "observation"),
      })),
    };
  }

  function validate(data) {
    if (!data.reference || !data.client || !data.date) {
      return "Renseignez la référence, le client et la date du devis.";
    }

    if (!data.items.length) {
      return "Ajoutez au moins une menuiserie au devis.";
    }

    const incomplete = data.items.findIndex(
      (item) =>
        !item.type ||
        !item.model ||
        !item.width ||
        !item.height ||
        !item.position ||
        !item.quantity ||
        Number(item.width) < 1 ||
        Number(item.height) < 1 ||
        Number(item.quantity) < 1
    );

    return incomplete >= 0
      ? `Complétez les champs obligatoires de la menuiserie ${
          incomplete + 1
        }.`
      : "";
  }

  function formatDate(date) {
    if (!date) {
      return "—";
    }

    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  function safeFileName(reference) {
    const cleaned = reference
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();

    return `cotation-${cleaned || "sans-reference"}.pdf`;
  }

  function drawWrapped(doc, text, x, y, maxWidth, lineHeight = 5) {
    const lines = doc.splitTextToSize(String(text || "—"), maxWidth);

    doc.text(lines, x, y);

    return y + lines.length * lineHeight;
  }

  function generatePdf(data) {
    const jsPDF = window.jspdf && window.jspdf.jsPDF;

    if (!jsPDF) {
      throw new Error(
        "La bibliothèque PDF n’est pas disponible. Vérifiez la connexion internet."
      );
    }

    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;

    let y = 18;

    const ensureSpace = (height = 18) => {
      if (y + height > pageHeight - 16) {
        doc.addPage();
        y = 18;
      }
    };

    const line = () => {
      doc.setDrawColor(220, 227, 226);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
    };

    const section = (title) => {
      ensureSpace(20);

      doc.setFillColor(49, 88, 82);
      doc.rect(margin, y - 5, 3, 9, "F");

      doc.setTextColor(49, 88, 82);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(title, margin + 8, y + 2);

      y += 13;
    };

    doc.setTextColor(37, 63, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("COTATION MENUISERIE", margin, y);

    doc.setTextColor(182, 109, 67);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      "RAPPORT DE CHIFFRAGE",
      pageWidth - margin,
      y,
      { align: "right" }
    );

    y += 7;

    doc.setTextColor(115, 128, 132);
    doc.setFontSize(9);
    doc.text("Document généré localement", margin, y);

    y += 5;
    line();

    section("Informations générales");

    doc.setTextColor(30, 41, 45);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text("Référence devis", margin, y);
    doc.text(data.reference, margin + 42, y);
    y += 7;

    doc.text("Client", margin, y);
    doc.text(data.client, margin + 42, y);
    y += 7;

    doc.text("Date", margin, y);
    doc.text(formatDate(data.date), margin + 42, y);
    y += 5;

    line();

    section(`Menuiseries (${data.items.length})`);

    data.items.forEach((item, index) => {
      ensureSpace(62);

      doc.setFillColor(242, 246, 244);
      doc.roundedRect(
        margin,
        y - 5,
        pageWidth - margin * 2,
        10,
        2,
        2,
        "F"
      );

      doc.setTextColor(49, 88, 82);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(
        `MENUISERIE ${String(index + 1).padStart(2, "0")}`,
        margin + 5,
        y + 2
      );

      y += 13;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 41, 45);
      doc.setFontSize(9.5);

      const rows = [
        ["Type", item.type],
        ["Modèle", item.model],
        ["Dimensions", `${item.width} × ${item.height} mm`],
        ["Position", item.position],
        ["Quantité", item.quantity],
      ];

      rows.forEach(([label, val]) => {
        doc.setTextColor(115, 128, 132);
        doc.text(label, margin + 5, y);

        doc.setTextColor(30, 41, 45);
        doc.text(String(val || "—"), margin + 38, y);

        y += 6;
      });

      if (item.observation) {
        doc.setTextColor(115, 128, 132);
        doc.text("Observation", margin + 5, y);

        doc.setTextColor(30, 41, 45);

        y = drawWrapped(
          doc,
          item.observation,
          margin + 38,
          y,
          pageWidth - margin * 2 - 43,
          4.5
        );
      }

      y += 5;
    });

    doc.setDrawColor(182, 109, 67);
    doc.setLineWidth(0.7);
    doc.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13);
    doc.setLineWidth(0.2);

    doc.setTextColor(115, 128, 132);
    doc.setFontSize(8);
    doc.text(data.reference, margin, pageHeight - 8);
    doc.text(
      "ATELIER · COTATIONS MENUISERIE",
      pageWidth - margin,
      pageHeight - 8,
      { align: "right" }
    );

    doc.save(safeFileName(data.reference));
  }

  addButton.addEventListener("click", addMenuiserie);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = collectData();
    const error = validate(data);

    if (error) {
      showFeedback(error);
      return;
    }

    try {
      generatePdf(data);
      showFeedback(
        "Rapport PDF généré et téléchargement lancé.",
        "success"
      );
    } catch (error) {
      showFeedback(
        error.message || "Impossible de générer le PDF."
      );
    }
  });

  // Une première menuiserie est disponible dès l’ouverture.
  addMenuiserie();
})();
