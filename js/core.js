// Variables globales
let equationCount = 0;
let constraints = [];

// Fonction pour ajouter une équation/contrainte
function addEquation() {
    equationCount++;
    const container = document.getElementById('equations');
    
    const constraintDiv = document.createElement('div');
    constraintDiv.className = 'constraint-item';
    constraintDiv.setAttribute('role', 'listitem');
    constraintDiv.innerHTML = `
        <div class="constraint-header">
            <span class="constraint-label">Contrainte ${equationCount}</span>
            <button class="btn-remove" onclick="removeConstraint(this)" aria-label="Supprimer cette contrainte">
                <span class="material-icons">delete</span>
            </button>
        </div>
        <div class="constraint-inputs">
            <div class="input-group">
                <label class="input-label">X₁</label>
                <input type="number" class="form-input constraint-a" placeholder="0" step="0.1">
            </div>
            <span class="operator">+</span>
            <div class="input-group">
                <label class="input-label">X₂</label>
                <input type="number" class="form-input constraint-b" placeholder="0" step="0.1">
            </div>
            <div class="input-group">
                <select class="form-select constraint-op">
                    <option value="<=">&le;</option>
                    <option value=">=">&ge;</option>
                    <option value="=">=</option>
                </select>
            </div>
            <div class="input-group">
                <label class="input-label">Valeur</label>
                <input type="number" class="form-input constraint-c" placeholder="0" step="0.1">
            </div>
        </div>
    `;
    
    container.appendChild(constraintDiv);
    
    // Animation d'apparition
    setTimeout(() => {
        constraintDiv.style.opacity = '1';
        constraintDiv.style.transform = 'translateY(0)';
    }, 10);
}

// Fonction pour supprimer une contrainte
function removeConstraint(button) {
    const constraintItem = button.closest('.constraint-item');
    constraintItem.style.opacity = '0';
    constraintItem.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        constraintItem.remove();
        updateConstraintLabels();
    }, 300);
}

// Mettre à jour les labels des contraintes
function updateConstraintLabels() {
    const constraints = document.querySelectorAll('.constraint-item');
    constraints.forEach((constraint, index) => {
        const label = constraint.querySelector('.constraint-label');
        label.textContent = `Contrainte ${index + 1}`;
    });
    equationCount = constraints.length;
}

// Fonction pour effacer tout
function clearAll() {
    // Effacer la fonction objectif
    document.getElementById('objX1').value = '';
    document.getElementById('objX2').value = '';
    document.getElementById('maxRadio').checked = true;
    
    // Effacer toutes les contraintes
    const container = document.getElementById('equations');
    container.innerHTML = '';
    equationCount = 0;
    
    // Masquer les résultats
    document.getElementById('resultsPanel').style.display = 'none';
    
    // Masquer le graphique et afficher le placeholder
    document.getElementById('plotDiv').style.display = 'none';
    document.getElementById('plotPlaceholder').style.display = 'flex';
    
    console.log('Données effacées');
}

// Fonction de résolution (version basique pour test)
function solve() {
    console.log('Résolution du problème...');
    
    // Vérifier les données
    const objX1 = parseFloat(document.getElementById('objX1').value) || 0;
    const objX2 = parseFloat(document.getElementById('objX2').value) || 0;
    
    if (objX1 === 0 && objX2 === 0) {
        alert('Veuillez définir une fonction objectif valide');
        return;
    }
    
    const constraintItems = document.querySelectorAll('.constraint-item');
    if (constraintItems.length === 0) {
        alert('Veuillez ajouter au moins une contrainte');
        return;
    }
    
    // Simuler un calcul
    showLoading('Calcul de la solution...');
    
    setTimeout(() => {
        hideLoading();
        
        // Afficher des résultats factices pour test
        showResults({
            x1: 2,
            x2: 3,
            value: objX1 * 2 + objX2 * 3,
            type: document.querySelector('input[name="optimization"]:checked').value
        });
        
        // Créer un graphique simple
        createSimplePlot();
        
    }, 2000);
}

// Afficher le loading
function showLoading(message = 'Chargement...') {
    const overlay = document.getElementById('loadingOverlay');
    const messageEl = document.getElementById('loadingMessage');
    
    if (messageEl) {
        messageEl.textContent = message;
    }
    
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
}

// Masquer le loading
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
}

// Afficher les résultats
function showResults(results) {
    const panel = document.getElementById('resultsPanel');
    const content = document.getElementById('resultsContent');
    
    const action = results.type === 'max' ? 'Maximum' : 'Minimum';
    
    content.innerHTML = `
        <div class="result-item">
            <span class="result-label">X₁ optimal</span>
            <span class="result-value">${results.x1}</span>
        </div>
        <div class="result-item">
            <span class="result-label">X₂ optimal</span>
            <span class="result-value">${results.x2}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Valeur ${action.toLowerCase()}</span>
            <span class="result-value">${results.value.toFixed(2)}</span>
        </div>
    `;
    
    panel.style.display = 'block';
}

// Créer un graphique simple pour test
function createSimplePlot() {
    const plotDiv = document.getElementById('plotDiv');
    const placeholder = document.getElementById('plotPlaceholder');
    
    // Données de test
    const trace1 = {
        x: [0, 1, 2, 3, 4],
        y: [0, 1, 4, 2, 3],
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Contrainte 1',
        line: { color: '#007bff' }
    };
    
    const trace2 = {
        x: [2],
        y: [3],
        type: 'scatter',
        mode: 'markers',
        name: 'Point optimal',
        marker: { 
            color: '#dc3545', 
            size: 12,
            symbol: 'star'
        }
    };
    
    const layout = {
        title: 'Solution de Programmation Linéaire',
        xaxis: { title: 'X₁' },
        yaxis: { title: 'X₂' },
        showlegend: true
    };
    
    Plotly.newPlot(plotDiv, [trace1, trace2], layout);
    
    // Afficher le graphique
    plotDiv.style.display = 'block';
    placeholder.style.display = 'none';
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application initialisée');
    
    // S'assurer que le loading est masqué au démarrage
    hideLoading();
    
    // Ajouter les event listeners
    const solveBtn = document.getElementById('solveBtn');
    if (solveBtn) {
        solveBtn.addEventListener('click', solve);
    }
    
    // Ajouter une contrainte par défaut
    addEquation();
});
