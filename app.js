// Gestion des repères et génération du rapport PDF

let compteurRepere = 0;

const reperesContainer = document.getElementById('reperesContainer');
const template = document.getElementById('repere-template');

function ajouterRepere() {
  compteurRepere += 1;
  const clone = template.content.cloneNode(true);
  clone.querySelector('.repere-numero').textContent = compteurRepere;
  clone.querySelector('.supprimer-repere').addEventListener('click', (e) => {
    e.target.closest('.repere-card').remove();
    renumeroterReperes();
  });
  reperesContainer.appendChild(clone);
}

function renumeroterReperes() {
  const cards = reperesContainer.querySelectorAll('.repere-card');
  compteurRepere = cards.length;
  cards.forEach((card, index) => {
    card.querySelector('.repere-numero').textContent = index + 1;
  });
}

function lireDonneesRepere(card, index) {
  return {
    numero: index + 1,
    type: card.querySelector('.type-menuiserie').selectedOptions[0].textContent,
    largeur: card.querySelector('.largeur').value,
    hauteur: card.querySelector('.hauteur').value,
    coteBati: card.querySelector('.cote-bati').value,
    typeVitrage: card.querySelector('.type-vitrage').selectedOptions[0].textContent,
    referencePanneau: card.querySelector('.reference-panneau').value,
    teinteExterieur: card.querySelector('.teinte-exterieur').value,
    teinteInterieur: card.querySelector('.teinte-interieur').value,
    remarques: card.querySelector('.remarques').value,
  };
}

function genererPdf() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const nomClient = document.getElementById('nomClient').value || 'Client';
  const dateRapport = document.getElementById('dateRapport').value || new Date().toLocaleDateString('fr-FR');
  const materiauColoris = document.getElementById('materiauColoris').value || '';

  const marge = 15;
  let y = marge;

  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text('Rapport de Cotes Menuiserie', marge, y);
  y += 8;

  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  doc.text(`Client / Dossier : ${nomClient}`, marge, y);
  y += 6;
  doc.text(`Date : ${dateRapport}`, marge, y);
  y += 6;
  if (materiauColoris) {
    doc.text(`Matériau / Coloris : ${materiauColoris}`, marge, y);
    y += 6;
  }

  doc.setDrawColor(200, 190, 180);
  doc.line(marge, y, 210 - marge, y);
  y += 8;

  const cards = reperesContainer.querySelectorAll('.repere-card');

  cards.forEach((card, index) => {
    const data = lireDonneesRepere(card, index);

    if (y > 250) {
      doc.addPage();
      y = marge;
    }

    doc.setFillColor(250, 248, 245);
    doc.setDrawColor(216, 207, 196);
    doc.roundedRect(marge, y, 210 - 2 * marge, 46, 2, 2, 'FD');

    doc.setFontSize(13);
    doc.setTextColor(122, 92, 62);
    doc.text(`Repère ${data.numero} — ${data.type}`, marge + 4, y + 7);

    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);

    const col1x = marge + 4;
    const col2x = marge + 90;
    let ligneY = y + 14;

    doc.text(`Largeur : ${data.largeur || '-'} mm`, col1x, ligneY);
    doc.text(`Hauteur : ${data.hauteur || '-'} mm`, col2x, ligneY);
    ligneY += 6;

    doc.text(`Cote bâti : ${data.coteBati || '-'} mm`, col1x, ligneY);
    doc.text(`Vitrage : ${data.typeVitrage}`, col2x, ligneY);
    ligneY += 6;

    doc.text(`Réf. panneau : ${data.referencePanneau || '-'}`, col1x, ligneY);
    doc.text(`Teinte ext/int : ${data.teinteExterieur || '-'} / ${data.teinteInterieur || '-'}`, col2x, ligneY);
    ligneY += 6;

    if (data.remarques) {
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Remarques : ${data.remarques}`, col1x, ligneY, { maxWidth: 180 });
    }

    y += 52;
  });

  doc.save(`rapport-cotes-${nomClient.replace(/\s+/g, '-')}.pdf`);
}

document.getElementById('ajouterRepere').addEventListener('click', ajouterRepere);
document.getElementById('genererPdf').addEventListener('click', genererPdf);

// Ajouter un premier repère par défaut au chargement
ajouterRepere();
