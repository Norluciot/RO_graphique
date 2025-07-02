// Configuration globale de l'application OptimGraph
window.OptimGraphConfig = {
    // Version de l'application
    version: '1.0.0',
    
    // Configuration Plotly
    plotly: {
        config: {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: [
                'pan2d', 
                'lasso2d', 
                'select2d', 
                'autoScale2d',
                'hoverClosestCartesian',
                'hoverCompareCartesian',
                'toggleSpikelines'
            ],
            displaylogo: false,
            toImageButtonOptions: {
                format: 'png',
                filename: 'programmation_lineaire_solution',
                height: 800,
                width: 1200,
                scale: 2
            },
            locale: 'fr'
        },
        
        layout: {
            font: {
                family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                size: 12,
                color: '#212529'
            },
            margin: {
                l: 60,
                r: 60,
                t: 80,
                b: 60
            },
            plot_bgcolor: '#fafafa',
            paper_bgcolor: '#ffffff',
            showlegend: true,
            legend: {
                x: 1,
                y: 1,
                xanchor: 'right',
                yanchor: 'top',
                bgcolor: 'rgba(255,255,255,0.8)',
                bordercolor: '#dee2e6',
                borderwidth: 1
            },
            xaxis: {
                title: 'X₁',
                gridcolor: '#e0e0e0',
                zerolinecolor: '#666666',
                showgrid: true,
                zeroline: true
            },
            yaxis: {
                title: 'X₂',
                gridcolor: '#e0e0e0',
                zerolinecolor: '#666666',
                showgrid: true,
                zeroline: true
            }
        },
        
        // Couleurs pour les différents éléments du graphique
        colors: {
            constraints: '#6c757d',
            feasibleRegion: 'rgba(0, 123, 255, 0.3)',
            feasibleRegionBorder: '#007bff',
            objectiveFunction: '#28a745',
            optimalPoint: '#dc3545',
            axes: '#666666'
        }
    },
    
    // Configuration des contraintes
    constraints: {
        maxCount: 15,
        defaultOperator: '<=',
        validOperators: [
            { value: '<=', label: '≤', text: 'inférieur ou égal' },
            { value: '>=', label: '≥', text: 'supérieur ou égal' },
            { value: '=', label: '=', text: 'égal' }
        ],
        defaultCoefficients: {
            a: 1,
            b: 1,
            c: 1
        }
    },
    
    // Configuration des notifications
    notifications: {
        duration: 5000,
        maxCount: 5,
        position: 'top-right',
        types: {
            success: {
                icon: 'check_circle',
                color: '#28a745'
            },
            error: {
                icon: 'error',
                color: '#dc3545'
            },
            warning: {
                icon: 'warning',
                color: '#ffc107'
            },
            info: {
                icon: 'info',
                color: '#17a2b8'
            }
        }
    },
    
    // Configuration de la sauvegarde locale
    storage: {
        key: 'optimgraph_data',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
        autoSave: true,
        autoSaveDelay: 2000 // 2 secondes après la dernière modification
    },
    
    // Configuration de l'interface utilisateur
    ui: {
        animations: {
            enabled: true,
            duration: 300,
            easing: 'ease'
        },
        responsive: {
            breakpoints: {
                mobile: 768,
                tablet: 1024,
                desktop: 1200
            }
        },
        theme: {
            default: 'light',
            available: ['light', 'dark']
        }
    },
    
    // Messages d'erreur et de succès
    messages: {
        errors: {
            invalidInput: 'Veuillez entrer des valeurs numériques valides',
            noObjective: 'Veuillez définir une fonction objectif',
            noConstraints: 'Veuillez ajouter au moins une contrainte',
            noSolution: 'Aucune solution réalisable trouvée',
            unboundedSolution: 'La solution est non bornée',
            calculationError: 'Erreur lors du calcul de la solution',
            plotError: 'Erreur lors de la génération du graphique',
            saveError: 'Erreur lors de la sauvegarde',
            loadError: 'Erreur lors du chargement des données',
            exportError: 'Erreur lors de l\'exportation',
            importError: 'Erreur lors de l\'importation',
            fullscreenError: 'Impossible d\'activer le mode plein écran'
        },
        
        success: {
            solutionFound: 'Solution optimale trouvée avec succès!',
            dataSaved: 'Données sauvegardées automatiquement',
            dataLoaded: 'Données chargées avec succès',
            dataCleared: 'Toutes les données ont été effacées',
            exported: 'Données exportées avec succès',
            imported: 'Données importées avec succès',
            plotDownloaded: 'Graphique téléchargé avec succès'
        },
        
        warnings: {
            noData: 'Aucune donnée à traiter',
            slowCalculation: 'Calcul lent détecté, considérez simplifier le problème',
            oldData: 'Les données sauvegardées sont anciennes',
            unsavedChanges: 'Vous avez des modifications non sauvegardées'
        },
        
        info: {
            calculating: 'Calcul de la solution en cours...',
            loading: 'Chargement...',
            saving: 'Sauvegarde en cours...',
            welcome: 'Bienvenue dans OptimGraph!'
        }
    },
    
    // Configuration des raccourcis clavier
    shortcuts: {
        solve: 'Ctrl+Enter',
        newConstraint: 'Ctrl+N',
        clear: 'Ctrl+R',
        help: 'F1',
        fullscreen: 'F11',
        export: 'Ctrl+E',
        import: 'Ctrl+I'
    },
    
    // Configuration de l'aide
    help: {
        examples: [
            {
                title: 'Exemple simple',
                objective: { type: 'max', x1: 3, x2: 2 },
                constraints: [
                    { a: 1, b: 1, op: '<=', c: 4 },
                    { a: 2, b: 1, op: '<=', c: 6 }
                ],
                description: 'Maximiser 3X₁ + 2X₂ sous les contraintes X₁ + X₂ ≤ 4 et 2X₁ + X₂ ≤ 6'
            },
            {
                title: 'Problème de minimisation',
                objective: { type: 'min', x1: 2, x2: 3 },
                constraints: [
                    { a: 1, b: 2, op: '>=', c: 6 },
                    { a: 3, b: 1, op: '>=', c: 9 }
                ],
                description: 'Minimiser 2X₁ + 3X₂ sous les contraintes X₁ + 2X₂ ≥ 6 et 3X₁ + X₂ ≥ 9'
            }
        ]
    },
    
    // Configuration de validation
    validation: {
        coefficients: {
            min: -1000,
            max: 1000,
            precision: 3
        },
        constraints: {
            minRequired: 1,
            maxAllowed: 15
        }
    },
    
    // Configuration de performance
    performance: {
        maxCalculationTime: 10000, // 10 secondes
        debounceDelay: 300,
        throttleDelay: 100
    },
    
    // Configuration d'accessibilité
    accessibility: {
        announceChanges: true,
        keyboardNavigation: true,
        highContrast: false,
        reducedMotion: false
    },
    
    // Configuration de développement
    development: {
        debug: false,
        logLevel: 'warn', // 'error', 'warn', 'info', 'debug'
        showPerformanceMetrics: false
    }
};

// Fonction pour obtenir une valeur de configuration
window.getConfig = function(path, defaultValue = null) {
    const keys = path.split('.');
    let current = window.OptimGraphConfig;
    
    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return defaultValue;
        }
    }
    
    return current;
};

// Fonction pour définir une valeur de configuration
window.setConfig = function(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = window.OptimGraphConfig;
    
    for (const key of keys) {
        if (!(key in current) || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }
    
    current[lastKey] = value;
};

// Initialisation de la configuration basée sur l'environnement
document.addEventListener('DOMContentLoaded', function() {
    // Détecter les préférences utilisateur
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setConfig('ui.animations.enabled', false);
        setConfig('accessibility.reducedMotion', true);
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        const savedTheme = localStorage.getItem('optimgraph_theme');
        if (!savedTheme) {
            setConfig('ui.theme.default', 'dark');
        }
    }
    
    // Détecter les capacités du navigateur
    if (!document.fullscreenEnabled) {
        // Désactiver le bouton plein écran si non supporté
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.style.display = 'none';
        }
    }
    
    // Configuration du mode développement
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setConfig('development.debug', true);
        setConfig('development.logLevel', 'debug');
    }
    
    // Log de la configuration si en mode debug
    if (getConfig('development.debug')) {
        console.log('OptimGraph Configuration:', window.OptimGraphConfig);
    }
});

// Export pour les modules ES6 si nécessaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.OptimGraphConfig;
}