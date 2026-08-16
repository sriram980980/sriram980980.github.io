// Navigation Controller
// Handles switching between Tree View and Flows View

class NavigationController {
    constructor() {
        this.currentView = 'tree';
        this.views = {
            tree: null,
            flows: null
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeViews();
        this.showView('tree');
    }

    setupEventListeners() {
        // Navigation menu clicks
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.addEventListener('click', () => {
                const view = navItem.dataset.view;
                this.switchToView(view);
            });
        });

        // Control buttons
        document.getElementById('reset-view').addEventListener('click', () => {
            this.resetCurrentView();
        });

        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardShortcuts(event);
        });
    }

    initializeViews() {
        // Initialize Tree View
        this.views.tree = new TreeView(TRADING_ECOSYSTEM_DATA);
        
        // Initialize Flows View
        this.views.flows = new FlowsView();
    }

    switchToView(viewName) {
        if (this.currentView === viewName) return;

        // Update navigation buttons
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        // Hide current view
        document.querySelectorAll('.view-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show new view
        document.getElementById(`${viewName}-view`).classList.add('active');

        this.currentView = viewName;

        // Trigger view-specific initialization if needed
        this.onViewChanged(viewName);
    }

    showView(viewName) {
        this.switchToView(viewName);
    }

    onViewChanged(viewName) {
        // Perform any view-specific actions when switching
        switch(viewName) {
            case 'tree':
                this.handleTreeViewActivated();
                break;
            case 'flows':
                this.handleFlowsViewActivated();
                break;
        }

        // Track view changes
        this.trackViewChange(viewName);
    }

    handleTreeViewActivated() {
        // Refresh tree view if needed
        if (this.views.tree) {
            this.views.tree.refresh();
        }

        // Focus on search input for quick access
        setTimeout(() => {
            const searchInput = document.getElementById('tree-search');
            if (searchInput && document.activeElement !== searchInput) {
                searchInput.focus();
            }
        }, 300);
    }

    handleFlowsViewActivated() {
        // Ensure flows view is properly initialized
        if (this.views.flows) {
            // Reset any ongoing animations
            this.views.flows.resetFlow();
        }

        // Show welcome animation or highlight first scenario
        this.highlightFlowsFeatures();
    }

    highlightFlowsFeatures() {
        // Add subtle animation to scenario cards when first visiting
        setTimeout(() => {
            document.querySelectorAll('.scenario-card').forEach((card, index) => {
                setTimeout(() => {
                    card.style.transform = 'translateY(-5px)';
                    setTimeout(() => {
                        card.style.transform = 'translateY(0)';
                    }, 200);
                }, index * 100);
            });
        }, 500);
    }

    resetCurrentView() {
        switch(this.currentView) {
            case 'tree':
                this.resetTreeView();
                break;
            case 'flows':
                this.resetFlowsView();
                break;
        }
    }

    resetTreeView() {
        if (this.views.tree) {
            // Clear search
            document.getElementById('tree-search').value = '';
            
            // Collapse all nodes
            this.views.tree.collapseAll();
            
            // Clear selection
            this.views.tree.clearSelection();
            
            // Scroll to top
            document.querySelector('.tree-navigation').scrollTop = 0;
        }
    }

    resetFlowsView() {
        if (this.views.flows) {
            // Reset flow animation
            this.views.flows.resetFlow();
            
            // Clear scenario selection
            document.querySelectorAll('.scenario-card').forEach(card => {
                card.classList.remove('active');
            });
            
            // Clear flow canvas
            document.getElementById('flow-canvas').innerHTML = '';
            
            // Scroll to top
            document.querySelector('.flows-view').scrollTop = 0;
        }
    }

    exportData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            currentView: this.currentView,
            ecosystemData: TRADING_ECOSYSTEM_DATA,
            views: {}
        };

        // Export view-specific data
        if (this.views.tree) {
            exportData.views.tree = this.views.tree.exportTreeData();
        }

        if (this.views.flows) {
            exportData.views.flows = this.views.flows.exportScenarioData();
        }

        // Download as JSON file
        this.downloadJSON(exportData, 'trading-ecosystem-export.json');
        
        // Show success notification
        this.showNotification('Data exported successfully!', 'success');
    }

    downloadJSON(data, filename) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    handleKeyboardShortcuts(event) {
        // Don't handle shortcuts when typing in input fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        const key = event.key.toLowerCase();
        const ctrl = event.ctrlKey || event.metaKey;

        switch(key) {
            case '1':
                if (ctrl) {
                    event.preventDefault();
                    this.switchToView('tree');
                }
                break;
            case '2':
                if (ctrl) {
                    event.preventDefault();
                    this.switchToView('flows');
                }
                break;
            case 'r':
                if (ctrl) {
                    event.preventDefault();
                    this.resetCurrentView();
                }
                break;
            case 'e':
                if (ctrl) {
                    event.preventDefault();
                    this.exportData();
                }
                break;
            case 'f':
                if (ctrl && this.currentView === 'tree') {
                    event.preventDefault();
                    document.getElementById('tree-search').focus();
                }
                break;
            case 'escape':
                this.handleEscapeKey();
                break;
            case 'h':
                if (ctrl) {
                    event.preventDefault();
                    this.showKeyboardHelp();
                }
                break;
        }
    }

    handleEscapeKey() {
        // Close any open modals or reset current view
        const modals = document.querySelectorAll('.step-modal');
        if (modals.length > 0) {
            modals.forEach(modal => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            });
            return;
        }

        // Clear selection in tree view
        if (this.currentView === 'tree' && this.views.tree) {
            this.views.tree.clearSelection();
        }

        // Reset flows view
        if (this.currentView === 'flows' && this.views.flows) {
            this.views.flows.resetFlow();
        }
    }

    showKeyboardHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'help-modal';
        helpModal.innerHTML = `
            <div class="help-content">
                <div class="help-header">
                    <h3>Keyboard Shortcuts</h3>
                    <button class="help-close">&times;</button>
                </div>
                <div class="help-body">
                    <div class="shortcut-section">
                        <h4>Navigation</h4>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>1</kbd>
                            <span>Switch to Tree View</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>2</kbd>
                            <span>Switch to Flows View</span>
                        </div>
                    </div>
                    
                    <div class="shortcut-section">
                        <h4>Tree View</h4>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>F</kbd>
                            <span>Focus Search</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Esc</kbd>
                            <span>Clear Selection</span>
                        </div>
                    </div>
                    
                    <div class="shortcut-section">
                        <h4>General</h4>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>R</kbd>
                            <span>Reset Current View</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>E</kbd>
                            <span>Export Data</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>H</kbd>
                            <span>Show This Help</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        helpModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        // Close modal functionality
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal || e.target.classList.contains('help-close')) {
                document.body.removeChild(helpModal);
            }
        });

        document.body.appendChild(helpModal);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 1500;
            font-weight: 500;
            max-width: 300px;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    trackViewChange(viewName) {
        // Simple event tracking
        console.log('View changed to:', viewName, {
            timestamp: new Date().toISOString(),
            previousView: this.currentView,
            newView: viewName
        });
    }

    // Public API methods
    getCurrentView() {
        return this.currentView;
    }

    getView(viewName) {
        return this.views[viewName];
    }

    refreshCurrentView() {
        switch(this.currentView) {
            case 'tree':
                if (this.views.tree) {
                    this.views.tree.refresh();
                }
                break;
            case 'flows':
                if (this.views.flows) {
                    this.views.flows.resetFlow();
                }
                break;
        }
    }

    // Accessibility helpers
    announceViewChange(viewName) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        
        const viewNames = {
            tree: 'Ecosystem Tree View',
            flows: 'Transaction Flows View'
        };
        
        announcement.textContent = `Switched to ${viewNames[viewName] || viewName}`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Export for global use
window.NavigationController = NavigationController;
