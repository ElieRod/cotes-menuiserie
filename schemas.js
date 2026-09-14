// Mapping des types de menuiseries aux chemins des schémas
const schemasMap = {
    'fenetre-fixe': 'assets/schemas/chassis-fixe.svg',
    'fenetre-1-vantail': 'assets/schemas/fenetre-1-vantail.svg',
    'fenetre-2-vantaux': 'assets/schemas/fenetre-2-vantaux.svg',
    'fenetre-coulissante': 'assets/schemas/coulissant.svg',
    'fenetre-oscillo-battant': 'assets/schemas/oscillo-battant.svg',
    'porte-1-vantail': 'assets/schemas/porte-1-vantail.svg',
    'porte-2-vantaux': 'assets/schemas/porte-2-vantaux.svg',
    'autre': 'assets/schemas/autre.svg'
};

/**
 * Retourne le chemin du schéma SVG pour un type de menuiserie
 * @param {string} type - Le type de menuiserie
 * @returns {string} - Le chemin du fichier SVG
 */
function cheminSchema(type) {
    return schemasMap[type] || schemasMap['autre'];
}

/**
 * Retourne le HTML pour afficher un schéma
 * @param {string} type - Le type de menuiserie
 * @returns {string} - Le HTML du schéma
 */
function afficherSchema(type) {
    const chemin = cheminSchema(type);
    return `<div class="schema-preview">
        <img src="${chemin}" alt="Schéma: ${type}" style="max-width: 150px; height: auto;">
    </div>`;
}
