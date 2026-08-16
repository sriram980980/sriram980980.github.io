// Main Application Entry Point
// This file initializes and coordinates all components of the trading ecosystem mind map

class TradingEcosystemApp {
    constructor() {
        this.mindMap = null;
        this.slideSystem = null;
        this.interactionManager = null;
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        try {
            this.showLoadingOverlay();
            
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize components in sequence
            await this.initializeMindMap();
            await this.initializeSlideSystem();
            await this.initializeInteractionManager();
            await this.setupGlobalEventListeners();
            await this.enhanceUI();
            
            this.isInitialized = true;
            this.hideLoadingOverlay();
            
            // Start with a welcome animation
            this.playWelcomeAnimation();
            
            console.log('Trading Ecosystem Mind Map initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Trading Ecosystem Mind Map:', error);
            this.showErrorMessage('Failed to load the application. Please refresh the page.');
        }
    }

    async initializeMindMap() {
        return new Promise((resolve) => {
            this.mindMap = new MindMap('#mind-map', TRADING_ECOSYSTEM_DATA);
            
            // Wait for initial render to complete
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }

    async initializeSlideSystem() {
        return new Promise((resolve) => {
            this.slideSystem = new SlideSystem(this.mindMap);
            resolve();
        });
    }

    async initializeInteractionManager() {
        return new Promise((resolve) => {
            this.interactionManager = new InteractionManager(this.mindMap, this.slideSystem);
            resolve();
        });
    }

    async setupGlobalEventListeners() {
        // Window resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleWindowResize();
        }, 250));

        // Visibility change handler (pause animations when tab not visible)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Error handling
        window.addEventListener('error', (event) => {
            console.error('Application error:', event.error);
        });

        // Unload warning (if user is in middle of guided tour)
        window.addEventListener('beforeunload', (event) => {
            if (this.slideSystem && this.slideSystem.isInGuidedMode() && this.slideSystem.getCurrentSlide() > 1) {
                event.preventDefault();
                event.returnValue = 'Your progress in the guided tour will be lost. Are you sure you want to leave?';
                return event.returnValue;
            }
        });
    }

    async enhanceUI() {
        // Add loading transitions
        this.addUITransitions();
        
        // Setup theme management
        this.setupThemeManagement();
        
        // Add performance monitoring
        this.setupPerformanceMonitoring();
        
        // Add analytics (if needed)
        this.setupAnalytics();
    }

    addUITransitions() {
        // Add smooth transitions to UI elements
        const elementsToAnimate = [
            '.header',
            '.slide-navigation',
            '.slide-panel',
            '.legend',
            '.search-container'
        ];

        elementsToAnimate.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.transition = 'all 0.3s ease';
            }
        });
    }

    setupThemeManagement() {
        // Add theme toggle functionality (could be extended for dark/light themes)
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Listen for theme changes
        prefersDarkScheme.addEventListener('change', (event) => {
            this.handleThemeChange(event.matches ? 'dark' : 'light');
        });
    }

    setupPerformanceMonitoring() {
        // Monitor performance and optimize if needed
        if ('performance' in window) {
            // Log performance metrics
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('App Load Performance:', {
                        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        totalTime: perfData.loadEventEnd - perfData.fetchStart
                    });
                }, 0);
            });
        }
    }

    setupAnalytics() {
        // Placeholder for analytics setup
        // Could integrate with Google Analytics, Adobe Analytics, etc.
        this.trackEvent('app_initialized', {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        });
    }

    trackEvent(eventName, data = {}) {
        // Simple event tracking (could be extended)
        console.log('Event:', eventName, data);
        
        // Could send to analytics service
        // analytics.track(eventName, data);
    }

    handleWindowResize() {
        if (!this.isInitialized) return;

        // Update mind map dimensions
        if (this.mindMap) {
            this.mindMap.setupDimensions();
            this.mindMap.svg.attr('width', this.mindMap.width).attr('height', this.mindMap.height);
            this.mindMap.tree.size([this.mindMap.height - 100, this.mindMap.width - 200]);
            this.mindMap.update(this.mindMap.root);
        }

        this.trackEvent('window_resized', {
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden, pause animations
            if (this.slideSystem && this.slideSystem.isAutoPlaying()) {
                this.slideSystem.stopAutoPlay();
            }
        }
    }

    handleThemeChange(theme) {
        document.body.setAttribute('data-theme', theme);
        this.trackEvent('theme_changed', { theme });
    }

    showLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 500);
        }
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h3>Application Error</h3>
                <p>${message}</p>
                <button onclick="window.location.reload()">Reload Application</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            this.hideLoadingOverlay();
        }, 100);
    }

    playWelcomeAnimation() {
        // Create a welcoming animation sequence
        setTimeout(() => {
            // Animate legend appearance
            const legend = document.querySelector('.legend');
            if (legend) {
                legend.style.transform = 'translateX(100%)';
                legend.style.opacity = '0';
                
                setTimeout(() => {
                    legend.style.transition = 'all 1s ease';
                    legend.style.transform = 'translateX(0)';
                    legend.style.opacity = '1';
                }, 200);
            }
        }, 800);

        // Animate header
        setTimeout(() => {
            const header = document.querySelector('.header');
            if (header) {
                header.style.transform = 'translateY(-100%)';
                setTimeout(() => {
                    header.style.transition = 'all 0.8s ease';
                    header.style.transform = 'translateY(0)';
                }, 100);
            }
        }, 600);

        // Animate slide panel
        setTimeout(() => {
            const slidePanel = document.querySelector('.slide-panel');
            if (slidePanel) {
                slidePanel.style.transform = 'translateY(-100%)';
                slidePanel.style.opacity = '0';
                setTimeout(() => {
                    slidePanel.style.transition = 'all 0.8s ease';
                    slidePanel.style.transform = 'translateY(0)';
                    slidePanel.style.opacity = '1';
                }, 150);
            }
        }, 1000);

        this.trackEvent('welcome_animation_played');
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Public API methods for external interaction
    getCurrentSlide() {
        return this.slideSystem ? this.slideSystem.getCurrentSlide() : 1;
    }

    goToSlide(slideNumber) {
        if (this.slideSystem) {
            this.slideSystem.goToSlide(slideNumber);
            this.trackEvent('slide_navigation', { slide: slideNumber, method: 'api' });
        }
    }

    toggleMode() {
        if (this.slideSystem) {
            const currentMode = this.slideSystem.isInGuidedMode();
            this.slideSystem.setGuidedMode(!currentMode);
            this.trackEvent('mode_toggled', { mode: !currentMode ? 'guided' : 'free' });
        }
    }

    highlightNodes(nodeNames) {
        if (this.mindMap) {
            this.mindMap.highlightNodes(nodeNames);
            this.trackEvent('nodes_highlighted', { nodes: nodeNames });
        }
    }

    resetView() {
        if (this.mindMap) {
            this.mindMap.resetView();
            this.trackEvent('view_reset');
        }
    }

    // Data export functionality
    exportData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            currentSlide: this.getCurrentSlide(),
            ecosystemData: TRADING_ECOSYSTEM_DATA,
            slideContent: SLIDE_CONTENT
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'trading-ecosystem-data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.trackEvent('data_exported');
    }

    // Share functionality
    async shareView() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Trading Ecosystem Mind Map',
                    text: 'Explore the complete trading ecosystem with this interactive mind map',
                    url: window.location.href
                });
                this.trackEvent('view_shared', { method: 'native' });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: copy URL to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                this.showNotification('URL copied to clipboard!');
                this.trackEvent('view_shared', { method: 'clipboard' });
            } catch (error) {
                console.log('Error copying to clipboard:', error);
            }
        }
    }

    showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    }
}

// Initialize the application when DOM is ready
let app;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new TradingEcosystemApp();
    });
} else {
    app = new TradingEcosystemApp();
}

// Make app globally available for debugging and external interaction
window.TradingEcosystemApp = app;
