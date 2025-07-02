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

// Gestion des modals
document.addEventListener('DOMContentLoaded', function() {
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
});
