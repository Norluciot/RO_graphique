// Gestion de l'interface utilisateur moderne

// Fonction pour afficher les notifications
function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const config = window.OptimGraphConfig || {};
    const iconMap = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };

    notification.innerHTML = `
        <span class="material-icons">${iconMap[type] || 'info'}</span>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <span class="material-icons">close</span>
        </button>
    `;

    container.appendChild(notification);

    // Auto-suppression
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

// Gestion de la visualisation graphique
function setupVisualizationControls() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetZoomBtn = document.getElementById('resetZoomBtn');
    const plotDiv = document.getElementById('plotDiv');

    // Bouton plein écran
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    // Bouton téléchargement
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadPlot);
    }

    // Bouton reset zoom
    if (resetZoomBtn) {
        resetZoomBtn.addEventListener('click', resetPlotZoom);
    }

    // Gestion des événements de plein écran
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
}

// Fonction pour basculer en mode plein écran
function toggleFullscreen() {
    const plotContainer = document.querySelector('.visualization-area');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    if (!plotContainer) {
        showNotification('Erreur: Zone de visualisation non trouvée', 'error');
        return;
    }

    try {
        if (!document.fullscreenElement &&
            !document.webkitFullscreenElement &&
            !document.mozFullScreenElement &&
            !document.msFullscreenElement) {

            // Entrer en plein écran
            if (plotContainer.requestFullscreen) {
                plotContainer.requestFullscreen();
            } else if (plotContainer.webkitRequestFullscreen) {
                plotContainer.webkitRequestFullscreen();
            } else if (plotContainer.mozRequestFullScreen) {
                plotContainer.mozRequestFullScreen();
            } else if (plotContainer.msRequestFullscreen) {
                plotContainer.msRequestFullscreen();
            } else {
                showNotification('Le mode plein écran n\'est pas supporté par votre navigateur', 'warning');
                return;
            }
        } else {
            // Sortir du plein écran
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    } catch (error) {
        console.error('Erreur plein écran:', error);
        showNotification('Erreur lors du basculement en plein écran', 'error');
    }
}

// Gérer les changements de plein écran
function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const icon = fullscreenBtn?.querySelector('.material-icons');

    if (!icon) return;

    const isFullscreen = document.fullscreenElement ||
                        document.webkitFullscreenElement ||
                        document.mozFullScreenElement ||
                        document.msFullscreenElement;

    if (isFullscreen) {
        icon.textContent = 'fullscreen_exit';
        fullscreenBtn.setAttribute('data-tooltip', 'Quitter le plein écran (Échap)');
        document.querySelector('.visualization-area')?.classList.add('fullscreen-mode');

        // Redimensionner le graphique si Plotly est disponible
        setTimeout(() => {
            const plotDiv = document.getElementById('plotDiv');
            if (plotDiv && window.Plotly) {
                window.Plotly.Plots.resize(plotDiv);
            }
        }, 100);
    } else {
        icon.textContent = 'fullscreen';
        fullscreenBtn.setAttribute('data-tooltip', 'Mode plein écran (F11)');
        document.querySelector('.visualization-area')?.classList.remove('fullscreen-mode');

        // Redimensionner le graphique
        setTimeout(() => {
            const plotDiv = document.getElementById('plotDiv');
            if (plotDiv && window.Plotly) {
                window.Plotly.Plots.resize(plotDiv);
            }
        }, 100);
    }
}

// Fonction pour télécharger le graphique
function downloadPlot() {
    const plotDiv = document.getElementById('plotDiv');

    if (!plotDiv || !window.Plotly) {
        showNotification('Aucun graphique à télécharger', 'warning');
        return;
    }

    // Vérifier si le graphique existe
    if (!plotDiv.data || plotDiv.data.length === 0) {
        showNotification('Veuillez d\'abord résoudre le problème pour générer un graphique', 'info');
        return;
    }

    try {
        const filename = `programmation_lineaire_${new Date().toISOString().split('T')[0]}`;

        // Options de téléchargement
        const options = {
            format: 'png',
            width: 1200,
            height: 800,
            filename: filename
        };

        window.Plotly.downloadImage(plotDiv, options).then(() => {
            showNotification('Graphique téléchargé avec succès', 'success');
        }).catch(error => {
            console.error('Erreur téléchargement:', error);
            showNotification('Erreur lors du téléchargement du graphique', 'error');
        });
    } catch (error) {
        console.error('Erreur téléchargement:', error);
        showNotification('Erreur lors du téléchargement', 'error');
    }
}

// Fonction pour réinitialiser le zoom
function resetPlotZoom() {
    const plotDiv = document.getElementById('plotDiv');

    if (!plotDiv || !window.Plotly) {
        showNotification('Aucun graphique disponible', 'warning');
        return;
    }

    // Vérifier si le graphique existe
    if (!plotDiv.data || plotDiv.data.length === 0) {
        showNotification('Aucun graphique à réinitialiser', 'info');
        return;
    }

    try {
        // Réinitialiser le zoom et le pan
        window.Plotly.relayout(plotDiv, {
            'xaxis.autorange': true,
            'yaxis.autorange': true
        }).then(() => {
            showNotification('Zoom réinitialisé', 'success');
        }).catch(error => {
            console.error('Erreur reset zoom:', error);
            showNotification('Erreur lors de la réinitialisation du zoom', 'error');
        });
    } catch (error) {
        console.error('Erreur reset zoom:', error);
        showNotification('Erreur lors de la réinitialisation', 'error');
    }
}

// Gestion des modals
function setupModals() {
    // Modal d'aide
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (helpBtn && helpModal) {
        helpBtn.addEventListener('click', () => {
            helpModal.classList.add('active');
            helpModal.setAttribute('aria-hidden', 'false');
        });
    }

    if (closeModalBtn && helpModal) {
        closeModalBtn.addEventListener('click', () => {
            helpModal.classList.remove('active');
            helpModal.setAttribute('aria-hidden', 'true');
        });
    }

    // Fermer modal en cliquant sur l'overlay
    if (helpModal) {
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.classList.remove('active');
                helpModal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // Modal de confirmation
    const confirmModal = document.getElementById('confirmModal');
    const closeConfirmBtn = document.getElementById('closeConfirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    if (closeConfirmBtn && confirmModal) {
        closeConfirmBtn.addEventListener('click', () => {
            confirmModal.classList.remove('active');
            confirmModal.setAttribute('aria-hidden', 'true');
        });
    }

    if (cancelBtn && confirmModal) {
        cancelBtn.addEventListener('click', () => {
            confirmModal.classList.remove('active');
            confirmModal.setAttribute('aria-hidden', 'true');
        });
    }

    if (confirmModal) {
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) {
                confirmModal.classList.remove('active');
                confirmModal.setAttribute('aria-hidden', 'true');
            }
        });
    }
}

// Fonction pour afficher/masquer le loading
function showLoading(message = 'Calcul en cours...') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingMessage = document.getElementById('loadingMessage');

    if (loadingOverlay) {
        if (loadingMessage) {
            loadingMessage.textContent = message;
        }
        loadingOverlay.style.display = 'flex';
        loadingOverlay.setAttribute('aria-hidden', 'false');
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');

    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
        loadingOverlay.setAttribute('aria-hidden', 'true');
    }
}

// Fonction pour fermer toutes les modals
function closeAllModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    });
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les contrôles de visualisation
    setupVisualizationControls();

    // Initialiser les modals
    setupModals();

    // Gestion de la touche Échap pour sortir du plein écran
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Fermer les modals
            closeAllModals();

            // Sortir du plein écran si actif
            if (document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement) {

                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        }
    });
});

// Fonction utilitaire pour redimensionner le graphique
function resizePlot() {
    const plotDiv = document.getElementById('plotDiv');
    if (plotDiv && window.Plotly && plotDiv.data) {
        window.Plotly.Plots.resize(plotDiv);
    }
}

// Redimensionner le graphique lors du redimensionnement de la fenêtre
window.addEventListener('resize', function() {
    setTimeout(resizePlot, 100);
});

// Exporter les fonctions pour qu'elles soient accessibles globalement
window.toggleFullscreen = toggleFullscreen;
window.downloadPlot = downloadPlot;
window.resetPlotZoom = resetPlotZoom;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.closeAllModals = closeAllModals;
window.resizePlot = resizePlot;
