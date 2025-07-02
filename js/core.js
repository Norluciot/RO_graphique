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

// Fonction de résolution avec algorithme de programmation linéaire
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
    
    // Récupérer toutes les contraintes
    const constraints = [];
    constraintItems.forEach(item => {
        const a = parseFloat(item.querySelector('.constraint-a').value) || 0;
        const b = parseFloat(item.querySelector('.constraint-b').value) || 0;
        const op = item.querySelector('.constraint-op').value;
        const c = parseFloat(item.querySelector('.constraint-c').value) || 0;
        
        constraints.push({ a, b, op, c });
    });
    
    console.log('Contraintes:', constraints);
    console.log('Fonction objectif:', { objX1, objX2 });
    
    // Afficher le loading
    showLoading('Calcul de la solution...');
    
    setTimeout(() => {
        try {
            // Résoudre le problème
            const solution = solveLPGraphical(objX1, objX2, constraints);
            
            hideLoading();
            
            if (solution.feasible) {
                const optimizationType = document.querySelector('input[name="optimization"]:checked').value;
                
                showResults({
                    x1: solution.x1,
                    x2: solution.x2,
                    value: solution.value,
                    type: optimizationType
                });
                
                // Créer le graphique avec les vraies données
                createOptimalPlot(objX1, objX2, constraints, solution);
            } else {
                alert('Le problème n\'a pas de solution réalisable');
            }
            
        } catch (error) {
            hideLoading();
            console.error('Erreur lors de la résolution:', error);
            alert('Erreur lors du calcul de la solution');
        }
    }, 1000);
}

// Algorithme de résolution graphique pour programmation linéaire 2D
function solveLPGraphical(c1, c2, constraints) {
    console.log('Début de la résolution graphique...');
    
    // Trouver tous les points d'intersection
    const intersectionPoints = [];
    
    // Ajouter les intersections avec les axes
    intersectionPoints.push({ x: 0, y: 0 }); // Origine
    
    // Convertir les contraintes en format standard
    const standardConstraints = constraints.map(constraint => {
        let { a, b, op, c } = constraint;
        
        // Convertir >= en <= en multipliant par -1
        if (op === '>=') {
            a = -a;
            b = -b;
            c = -c;
            op = '<=';
        }
        
        return { a, b, c, op };
    });
    
    // Trouver les intersections entre chaque paire de contraintes
    for (let i = 0; i < standardConstraints.length; i++) {
        for (let j = i + 1; j < standardConstraints.length; j++) {
            const intersection = findIntersection(
                standardConstraints[i], 
                standardConstraints[j]
            );
            
            if (intersection) {
                intersectionPoints.push(intersection);
            }
        }
        
        // Intersections avec les axes
        const constraint = standardConstraints[i];
        
        // Intersection avec l'axe X (y = 0)
        if (constraint.b !== 0) {
            const x = constraint.c / constraint.a;
            if (x >= 0) {
                intersectionPoints.push({ x: x, y: 0 });
            }
        }
        
        // Intersection avec l'axe Y (x = 0)
        if (constraint.a !== 0) {
            const y = constraint.c / constraint.b;
            if (y >= 0) {
                intersectionPoints.push({ x: 0, y: y });
            }
        }
    }
    
    console.log('Points d\'intersection trouvés:', intersectionPoints);
    
    // Filtrer les points réalisables
    const feasiblePoints = intersectionPoints.filter(point => {
        return isFeasible(point, constraints);
    });
    
    console.log('Points réalisables:', feasiblePoints);
    
    if (feasiblePoints.length === 0) {
        return { feasible: false };
    }
    
    // Trouver le point optimal
    const optimizationType = document.querySelector('input[name="optimization"]:checked').value;
    let optimalPoint = feasiblePoints[0];
    let optimalValue = c1 * optimalPoint.x + c2 * optimalPoint.y;
    
    for (let i = 1; i < feasiblePoints.length; i++) {
        const point = feasiblePoints[i];
        const value = c1 * point.x + c2 * point.y;
        
        if ((optimizationType === 'max' && value > optimalValue) ||
            (optimizationType === 'min' && value < optimalValue)) {
            optimalPoint = point;
            optimalValue = value;
        }
    }
    
    console.log('Point optimal trouvé:', optimalPoint, 'Valeur:', optimalValue);
    
    return {
        feasible: true,
        x1: Math.round(optimalPoint.x * 100) / 100,
        x2: Math.round(optimalPoint.y * 100) / 100,
        value: Math.round(optimalValue * 100) / 100,
        feasibleRegion: feasiblePoints
    };
}

// Trouver l'intersection de deux droites
function findIntersection(constraint1, constraint2) {
    const { a: a1, b: b1, c: c1 } = constraint1;
    const { a: a2, b: b2, c: c2 } = constraint2;
    
    // Résoudre le système d'équations linéaires
    // a1*x + b1*y = c1
    // a2*x + b2*y = c2
    
    const determinant = a1 * b2 - a2 * b1;
    
    if (Math.abs(determinant) < 1e-10) {
        // Les droites sont parallèles
        return null;
    }
    
    const x = (c1 * b2 - c2 * b1) / determinant;
    const y = (a1 * c2 - a2 * c1) / determinant;
    
    return { x: x, y: y };
}

// Vérifier si un point satisfait toutes les contraintes
function isFeasible(point, constraints) {
    const { x, y } = point;
    
    // Vérifier les contraintes de non-négativité
    if (x < -1e-10 || y < -1e-10) {
        return false;
    }
    
    // Vérifier chaque contrainte
    for (const constraint of constraints) {
        const { a, b, op, c } = constraint;
        const value = a * x + b * y;
        
        if (op === '<=' && value > c + 1e-10) {
            return false;
        }
        if (op === '>=' && value < c - 1e-10) {
            return false;
        }
        if (op === '=' && Math.abs(value - c) > 1e-10) {
            return false;
        }
    }
    
    return true;
}

// Créer le graphique optimal avec les vraies données
function createOptimalPlot(objX1, objX2, constraints, solution) {
    const plotDiv = document.getElementById('plotDiv');
    const placeholder = document.getElementById('plotPlaceholder');
    
    const traces = [];
    
    // Déterminer les limites du graphique
    const maxX = Math.max(10, solution.x1 * 1.5);
    const maxY = Math.max(10, solution.x2 * 1.5);
    
    // Tracer chaque contrainte
    constraints.forEach((constraint, index) => {
        const { a, b, c } = constraint;
        const xValues = [];
        const yValues = [];
        
        if (Math.abs(b) > 1e-10) {
            // Droite non verticale
            for (let x = 0; x <= maxX; x += 0.1) {
                const y = (c - a * x) / b;
                if (y >= 0 && y <= maxY) {
                    xValues.push(x);
                    yValues.push(y);
                }
            }
        } else if (Math.abs(a) > 1e-10) {
            // Droite verticale
            const x = c / a;
            if (x >= 0 && x <= maxX) {
                xValues.push(x, x);
                yValues.push(0, maxY);
            }
        }
        
        if (xValues.length > 0) {
            traces.push({
                x: xValues,
                y: yValues,
                type: 'scatter',
                mode: 'lines',
                name: `Contrainte ${index + 1}`,
                line: { 
                    color: `hsl(${index * 60}, 70%, 50%)`,
                    width: 2
                }
            });
        }
    });
    
    // Point optimal
    traces.push({
        x: [solution.x1],
        y: [solution.x2],
        type: 'scatter',
        mode: 'markers',
        name: 'Point optimal',
        marker: { 
            color: '#dc3545', 
            size: 15,
            symbol: 'star'
        }
    });
    
    // Ligne de niveau de la fonction objectif
    const objLine = [];
    for (let x = 0; x <= maxX; x += 0.1) {
        if (Math.abs(objX2) > 1e-10) {
            const y = (solution.value - objX1 * x) / objX2;
            if (y >= 0 && y <= maxY) {
                objLine.push({ x, y });
            }
        }
    }
    
    if (objLine.length > 0) {
        traces.push({
            x: objLine.map(p => p.x),
            y: objLine.map(p => p.y),
            type: 'scatter',
            mode: 'lines',
            name: 'Fonction objectif',
            line: { 
                color: '#28a745',
                width: 3,
                dash: 'dash'
            }
        });
    }
    
    const layout = {
        title: `Solution de Programmation Linéaire<br>Optimal: (${solution.x1}, ${solution.x2}) = ${solution.value}`,
        xaxis: { 
            title: 'X₁',
            range: [0, maxX]
        },
        yaxis: { 
            title: 'X₂',
            range: [0, maxY]
        },
        showlegend: true,
        hovermode: 'closest'
    };
    
    Plotly.newPlot(plotDiv, traces, layout);
    
    // Afficher le graphique
    plotDiv.style.display = 'block';
    placeholder.style.display = 'none';
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
