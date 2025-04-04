/**
 * Bootstrap Tutorial - Components JavaScript File
 * Ces fonctions créent des composants dynamiques pour les exemples interactifs
 */

/**
 * Crée un toast Bootstrap avec le contenu spécifié
 * @param {string} title - Titre du toast
 * @param {string} message - Message principal
 * @param {string} type - Type de toast (success, danger, warning, info)
 * @param {number} delay - Délai avant disparition en ms
 * @returns {HTMLElement} - L'élément toast créé
 */
function createToast(title, message, type = 'info', delay = 5000) {
    const toastContainer = document.getElementById('toast-container');
    
    // Créer le conteneur s'il n'existe pas
    if (!toastContainer) {
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    
    // Générer un ID unique
    const toastId = 'toast-' + Date.now();
    
    // Créer le toast
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    toastEl.id = toastId;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.setAttribute('data-bs-delay', delay);
    
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong>${title}</strong>
                <div>${message}</div>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fermer"></button>
        </div>
    `;
    
    // Ajouter au conteneur
    document.getElementById('toast-container').appendChild(toastEl);
    
    // Initialiser et afficher
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    
    return toastEl;
}

/**
 * Crée une modal Bootstrap avec le contenu spécifié
 * @param {string} title - Titre de la modal
 * @param {string} content - Contenu HTML de la modal
 * @param {Function} onConfirm - Fonction à exécuter lors de la confirmation
 * @returns {HTMLElement} - L'élément modal créé
 */
function createModal(title, content, onConfirm = null) {
    // Générer un ID unique
    const modalId = 'modal-' + Date.now();
    
    // Créer la structure de la modal
    const modalEl = document.createElement('div');
    modalEl.className = 'modal fade';
    modalEl.id = modalId;
    modalEl.setAttribute('tabindex', '-1');
    modalEl.setAttribute('aria-labelledby', `${modalId}-label`);
    modalEl.setAttribute('aria-hidden', 'true');
    
    modalEl.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="${modalId}-label">${title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button type="button" class="btn btn-primary" id="${modalId}-confirm">Confirmer</button>
                </div>
            </div>
        </div>
    `;
    
    // Ajouter au body
    document.body.appendChild(modalEl);
    
    // Ajouter un gestionnaire d'événement pour le bouton de confirmation
    if (onConfirm) {
        document.getElementById(`${modalId}-confirm`).addEventListener('click', function() {
            onConfirm();
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
        });
    }
    
    // Initialiser et afficher
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    
    // Nettoyer après fermeture
    modalEl.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modalEl);
    });
    
    return modalEl;
}

/**
 * Crée un widget d'alerte avec différentes variantes de Bootstrap
 * @param {string} targetId - ID de l'élément où ajouter le widget
 */
function createAlertWidget(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    
    const widget = document.createElement('div');
    widget.className = 'alert-widget';
    
    // Ajouter les contrôles
    widget.innerHTML = `
        <div class="mb-3">
            <label for="alert-text" class="form-label">Texte de l'alerte</label>
            <input type="text" class="form-control" id="alert-text" value="Voici une alerte Bootstrap!">
        </div>
        
        <div class="mb-3">
            <label class="form-label">Type d'alerte</label>
            <div class="btn-group w-100" role="group">
                <input type="radio" class="btn-check" name="alert-type" id="alert-primary" value="primary" checked>
                <label class="btn btn-outline-primary" for="alert-primary">Primary</label>
                
                <input type="radio" class="btn-check" name="alert-type" id="alert-success" value="success">
                <label class="btn btn-outline-success" for="alert-success">Success</label>
                
                <input type="radio" class="btn-check" name="alert-type" id="alert-danger" value="danger">
                <label class="btn btn-outline-danger" for="alert-danger">Danger</label>
                
                <input type="radio" class="btn-check" name="alert-type" id="alert-warning" value="warning">
                <label class="btn btn-outline-warning" for="alert-warning">Warning</label>
                
                <input type="radio" class="btn-check" name="alert-type" id="alert-info" value="info">
                <label class="btn btn-outline-info" for="alert-info">Info</label>
            </div>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="alert-dismissible">
            <label class="form-check-label" for="alert-dismissible">Alerte fermable</label>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="alert-icon">
            <label class="form-check-label" for="alert-icon">Ajouter une icône</label>
        </div>
        
        <button class="btn btn-primary w-100" id="create-alert">Créer l'alerte</button>
        
        <div class="mt-4" id="alert-preview"></div>
    `;
    
    targetElement.appendChild(widget);
    
    // Ajouter le gestionnaire d'événement
    document.getElementById('create-alert').addEventListener('click', function() {
        const text = document.getElementById('alert-text').value;
        const type = document.querySelector('input[name="alert-type"]:checked').value;
        const dismissible = document.getElementById('alert-dismissible').checked;
        const useIcon = document.getElementById('alert-icon').checked;
        
        // Créer l'alerte
        const preview = document.getElementById('alert-preview');
        preview.innerHTML = '';
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.setAttribute('role', 'alert');
        
        if (dismissible) {
            alert.classList.add('alert-dismissible', 'fade', 'show');
            alert.innerHTML += '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>';
        }
        
        let iconHTML = '';
        if (useIcon) {
            const iconClass = getIconForAlertType(type);
            iconHTML = `<i class="${iconClass} me-2"></i>`;
        }
        
        alert.innerHTML = iconHTML + text + (dismissible ? alert.innerHTML : '');
        preview.appendChild(alert);
    });
}

/**
 * Obtient la classe d'icône pour le type d'alerte
 * @param {string} type - Type d'alerte
 * @returns {string} - Classe d'icône
 */
function getIconForAlertType(type) {
    const icons = {
        primary: 'bi bi-info-circle-fill',
        success: 'bi bi-check-circle-fill',
        danger: 'bi bi-exclamation-triangle-fill',
        warning: 'bi bi-exclamation-triangle-fill',
        info: 'bi bi-info-circle-fill'
    };
    
    return icons[type] || icons.primary;
}

/**
 * Crée un démo de grille responsive
 * @param {string} targetId - ID de l'élément où ajouter la démo
 */
function createGridDemo(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    
    const widget = document.createElement('div');
    widget.className = 'grid-demo mb-4';
    
    // Ajouter les contrôles
    widget.innerHTML = `
        <div class="mb-3">
            <label for="grid-columns" class="form-label">Nombre de colonnes</label>
            <input type="range" class="form-range" id="grid-columns" min="1" max="12" value="3">
            <div class="text-end"><span id="grid-columns-value">3</span> colonnes</div>
        </div>
        
        <div class="mb-3">
            <label class="form-label">Comportement responsive</label>
            <select class="form-select" id="grid-responsive">
                <option value="">Pas de responsive (col)</option>
                <option value="sm">Petits écrans et plus (col-sm)</option>
                <option value="md" selected>Écrans moyens et plus (col-md)</option>
                <option value="lg">Grands écrans et plus (col-lg)</option>
                <option value="xl">Très grands écrans (col-xl)</option>
            </select>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="grid-gutters" checked>
            <label class="form-check-label" for="grid-gutters">Ajouter des gouttières</label>
        </div>
        
        <button class="btn btn-primary w-100" id="update-grid">Mettre à jour la grille</button>
        
        <div class="mt-4 p-3 border rounded" id="grid-preview">
            <div class="row">
                <div class="col-md-4">
                    <div class="p-3 bg-primary text-white rounded">Colonne 1</div>
                </div>
                <div class="col-md-4">
                    <div class="p-3 bg-primary text-white rounded">Colonne 2</div>
                </div>
                <div class="col-md-4">
                    <div class="p-3 bg-primary text-white rounded">Colonne 3</div>
                </div>
            </div>
        </div>
    `;
    
    targetElement.appendChild(widget);
    
    // Mettre à jour l'affichage du nombre de colonnes
    document.getElementById('grid-columns').addEventListener('input', function() {
        document.getElementById('grid-columns-value').textContent = this.value;
    });
    
    // Mettre à jour la grille
    document.getElementById('update-grid').addEventListener('click', function() {
        const columns = parseInt(document.getElementById('grid-columns').value);
        const responsive = document.getElementById('grid-responsive').value;
        const gutters = document.getElementById('grid-gutters').checked;
        
        // Créer la grille
        const preview = document.getElementById('grid-preview');
        const row = document.createElement('div');
        row.className = gutters ? 'row' : 'row g-0';
        
        for (let i = 0; i < columns; i++) {
            const col = document.createElement('div');
            col.className = responsive ? `col-${responsive}` : 'col';
            
            if (responsive) {
                // Si responsive, on ajoute une classe pour que les colonnes soient empilées sur les petits écrans
                col.className = `col-${responsive}-${Math.floor(12 / columns)}`;
            } else {
                // Si pas responsive, les colonnes auront toutes la même taille
                col.className = `col`;
            }
            
            col.innerHTML = `<div class="p-3 bg-primary text-white rounded my-2">Colonne ${i + 1}</div>`;
            row.appendChild(col);
        }
        
        preview.innerHTML = '';
        preview.appendChild(row);
        
        // Générer le code HTML correspondant
        const codeDisplay = document.createElement('div');
        codeDisplay.className = 'mt-3 code-display';
        codeDisplay.setAttribute('data-language', 'html');
        
        const colClass = responsive ? `col-${responsive}-${Math.floor(12 / columns)}` : 'col';
        let codeHTML = `<div class="${gutters ? 'row' : 'row g-0'}">\n`;
        
        for (let i = 0; i < columns; i++) {
            codeHTML += `  <div class="${colClass}">\n    <div class="p-3 bg-primary text-white rounded">Colonne ${i + 1}</div>\n  </div>\n`;
        }
        
        codeHTML += '</div>';
        codeDisplay.textContent = codeHTML;
        
        preview.appendChild(codeDisplay);
    });
}

/**
 * Initialise tous les démos de composants
 */
function initializeComponentDemos() {
    // Initialiser ici tous les widgets de démo
    if (document.getElementById('alert-widget')) {
        createAlertWidget('alert-widget');
    }
    
    if (document.getElementById('grid-widget')) {
        createGridDemo('grid-widget');
    }
    
    // Initialiser d'autres widgets au besoin...
}

// Exporter les fonctions
window.createToast = createToast;
window.createModal = createModal;
window.initializeComponentDemos = initializeComponentDemos; 