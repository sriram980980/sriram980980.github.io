// Main Application Entry Point
// Coordinates all components and handles application lifecycle

class TradingEcosystemPlatform {
    constructor() {
        this.navigationController = null;
        this.isInitialized = false;
        this.loadingTimeout = null;
        
        this.init();
    }

    async init() {
        try {
            this.showLoadingOverlay();
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize components in sequence
            await this.validateDependencies();
            await this.initializeNavigation();
            await this.setupGlobalFeatures();
            await this.finalizeInitialization();
            
            this.isInitialized = true;
            this.hideLoadingOverlay();
            
            // Show welcome animation
            this.playWelcomeSequence();
            
            console.log('Trading Ecosystem Platform initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Trading Ecosystem Platform:', error);
            this.showErrorMessage('Failed to load the application. Please refresh the page.');
        }
    }

    async validateDependencies() {
        // Check if required dependencies are available
        const dependencies = [
            { name: 'D3.js', check: () => typeof d3 !== 'undefined' },
            { name: 'Data Model', check: () => typeof TRADING_ECOSYSTEM_DATA !== 'undefined' },
            { name: 'Category Colors', check: () => typeof getCategoryColor === 'function' }
        ];

        const missing = dependencies.filter(dep => !dep.check());
        
        if (missing.length > 0) {
            throw new Error(`Missing dependencies: ${missing.map(d => d.name).join(', ')}`);
        }

        return true;
    }

    async initializeNavigation() {
        return new Promise((resolve) => {
            this.navigationController = new NavigationController();
            
            // Wait for navigation to be fully set up
            setTimeout(() => {
                resolve();
            }, 300);
        });
    }

    async setupGlobalFeatures() {
        // Set up global error handling
        this.setupErrorHandling();
        
        // Set up performance monitoring
        this.setupPerformanceMonitoring();
        
        // Set up accessibility features
        this.setupAccessibilityFeatures();
        
        // Set up responsive behavior
        this.setupResponsiveBehavior();
        
        // Set up analytics
        this.setupAnalytics();
        
        return true;
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleApplicationError(event.error);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleApplicationError(event.reason);
        });
    }

    setupPerformanceMonitoring() {
        if ('performance' in window) {
            // Monitor initial load performance
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        this.logPerformanceMetrics({
                            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                            totalTime: perfData.loadEventEnd - perfData.fetchStart
                        });
                    }
                }, 0);
            });

            // Monitor memory usage if available
            if ('memory' in performance) {
                setInterval(() => {
                    this.checkMemoryUsage();
                }, 30000); // Check every 30 seconds
            }
        }
    }

    setupAccessibilityFeatures() {
        // Announce page load for screen readers
        this.announceForScreenReaders('Trading Ecosystem Platform loaded successfully');
        
        // Set up focus management
        this.setupFocusManagement();
        
        // Set up high contrast mode detection
        this.setupHighContrastMode();
        
        // Set up reduced motion detection
        this.setupReducedMotionMode();
    }

    setupResponsiveBehavior() {
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleWindowResize();
            }, 250);
        });

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 300);
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    setupAnalytics() {
        // Track application initialization
        this.trackEvent('app_initialized', {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            platform: navigator.platform
        });
    }

    async finalizeInitialization() {
        // Add any final setup steps
        this.addUIEnhancements();
        this.setupKeyboardShortcuts();
        this.preloadAssets();
        
        return true;
    }

    addUIEnhancements() {
        // Add smooth transitions to all interactive elements
        const style = document.createElement('style');
        style.textContent = `
            .nav-item, .tree-node-header, .scenario-card, button {
                transition: all 0.3s ease !important;
            }
            
            .tree-navigation, .flows-view {
                scroll-behavior: smooth;
            }
        `;
        document.head.appendChild(style);

        // Add loading states to buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                this.addButtonLoadingState(button);
            });
        });
    }

    setupKeyboardShortcuts() {
        // Global keyboard shortcuts that work across all views
        document.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();
            const ctrl = event.ctrlKey || event.metaKey;
            const shift = event.shiftKey;

            // Skip if user is typing in an input
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            switch(key) {
                case '?':
                    if (shift) {
                        event.preventDefault();
                        this.showKeyboardHelp();
                    }
                    break;
                case 'k':
                    if (ctrl) {
                        event.preventDefault();
                        this.showCommandPalette();
                    }
                    break;
            }
        });
    }

    preloadAssets() {
        // Preload any additional assets if needed
        const preloadAssets = [
            // Add any image or asset URLs to preload
        ];

        preloadAssets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = asset;
            link.as = 'image';
            document.head.appendChild(link);
        });
    }

    showLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }

        // Set a maximum loading time
        this.loadingTimeout = setTimeout(() => {
            this.hideLoadingOverlay();
            this.showErrorMessage('Loading is taking longer than expected. Please refresh the page.');
        }, 10000); // 10 seconds max
    }

    hideLoadingOverlay() {
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        }

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
                <h3>⚠️ Application Error</h3>
                <p>${message}</p>
                <div class="error-actions">
                    <button onclick="window.location.reload()" class="btn-primary">
                        🔄 Reload Application
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn-secondary">
                        ❌ Dismiss
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        this.hideLoadingOverlay();
    }

    playWelcomeSequence() {
        // Create a smooth welcome animation sequence
        const sequences = [
            { element: '.header', delay: 200, animation: 'slideInFromTop' },
            { element: '.main-nav', delay: 400, animation: 'fadeIn' },
            { element: '.tree-container', delay: 600, animation: 'slideInFromLeft' },
            { element: '.details-panel', delay: 800, animation: 'slideInFromRight' }
        ];

        sequences.forEach(seq => {
            setTimeout(() => {
                const element = document.querySelector(seq.element);
                if (element) {
                    element.style.opacity = '0';
                    element.style.transform = this.getAnimationTransform(seq.animation, 'initial');
                    
                    setTimeout(() => {
                        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                        element.style.opacity = '1';
                        element.style.transform = this.getAnimationTransform(seq.animation, 'final');
                    }, 50);
                }
            }, seq.delay);
        });

        this.trackEvent('welcome_animation_played');
    }

    getAnimationTransform(animation, state) {
        const transforms = {
            slideInFromTop: {
                initial: 'translateY(-50px)',
                final: 'translateY(0)'
            },
            slideInFromLeft: {
                initial: 'translateX(-50px)',
                final: 'translateX(0)'
            },
            slideInFromRight: {
                initial: 'translateX(50px)',
                final: 'translateX(0)'
            },
            fadeIn: {
                initial: 'scale(0.95)',
                final: 'scale(1)'
            }
        };

        return transforms[animation] ? transforms[animation][state] : 'none';
    }

    handleApplicationError(error) {
        // Log error details
        console.error('Application error details:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });

        // Track error
        this.trackEvent('application_error', {
            error: error.message,
            stack: error.stack?.substring(0, 500) // Limit stack trace length
        });

        // Show user-friendly error message for critical errors
        if (error.message && error.message.includes('dependencies')) {
            this.showErrorMessage('Some required resources failed to load. Please check your internet connection and refresh the page.');
        }
    }

    handleWindowResize() {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Update responsive classes
        document.body.className = document.body.className.replace(/viewport-\w+/g, '');
        
        if (viewport.width < 768) {
            document.body.classList.add('viewport-mobile');
        } else if (viewport.width < 1200) {
            document.body.classList.add('viewport-tablet');
        } else {
            document.body.classList.add('viewport-desktop');
        }

        // Notify navigation controller
        if (this.navigationController) {
            this.navigationController.refreshCurrentView();
        }

        this.trackEvent('window_resized', viewport);
    }

    handleOrientationChange() {
        this.trackEvent('orientation_changed', {
            orientation: window.orientation || screen.orientation?.angle || 'unknown'
        });
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.trackEvent('page_hidden');
        } else {
            this.trackEvent('page_visible');
        }
    }

    logPerformanceMetrics(metrics) {
        console.log('Performance Metrics:', metrics);
        this.trackEvent('performance_metrics', metrics);
    }

    checkMemoryUsage() {
        if ('memory' in performance) {
            const memory = performance.memory;
            const memoryInfo = {
                used: Math.round(memory.usedJSHeapSize / 1048576), // MB
                total: Math.round(memory.totalJSHeapSize / 1048576), // MB
                limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
            };

            // Warn if memory usage is high
            if (memoryInfo.used > memoryInfo.limit * 0.8) {
                console.warn('High memory usage detected:', memoryInfo);
                this.trackEvent('high_memory_usage', memoryInfo);
            }
        }
    }

    announceForScreenReaders(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    setupFocusManagement() {
        // Ensure proper focus indicators
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupHighContrastMode() {
        const mediaQuery = window.matchMedia('(prefers-contrast: high)');
        
        const handleContrastChange = (e) => {
            if (e.matches) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        };

        mediaQuery.addListener(handleContrastChange);
        handleContrastChange(mediaQuery);
    }

    setupReducedMotionMode() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleMotionChange = (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        };

        mediaQuery.addListener(handleMotionChange);
        handleMotionChange(mediaQuery);
    }

    addButtonLoadingState(button) {
        const originalText = button.textContent;
        button.textContent = '⏳ Loading...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 1000);
    }

    showKeyboardHelp() {
        if (this.navigationController) {
            this.navigationController.showKeyboardHelp();
        }
    }

    showCommandPalette() {
        // Create a command palette for quick actions
        const palette = document.createElement('div');
        palette.className = 'command-palette';
        palette.innerHTML = `
            <div class="palette-content">
                <input type="text" placeholder="Type a command..." class="palette-input" />
                <div class="palette-results">
                    <div class="palette-item" data-command="tree">📊 Switch to Tree View</div>
                    <div class="palette-item" data-command="flows">💰 Switch to Flows View</div>
                    <div class="palette-item" data-command="search">🔍 Search Ecosystem</div>
                    <div class="palette-item" data-command="export">📁 Export Data</div>
                    <div class="palette-item" data-command="reset">🔄 Reset View</div>
                    <div class="palette-item" data-command="help">❓ Show Help</div>
                </div>
            </div>
        `;

        palette.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding-top: 100px;
            z-index: 3000;
        `;

        document.body.appendChild(palette);
        palette.querySelector('.palette-input').focus();

        // Handle command execution
        palette.addEventListener('click', (e) => {
            if (e.target.classList.contains('palette-item')) {
                this.executeCommand(e.target.dataset.command);
                document.body.removeChild(palette);
            } else if (e.target === palette) {
                document.body.removeChild(palette);
            }
        });

        // Handle escape key
        palette.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(palette);
            }
        });
    }

    executeCommand(command) {
        switch(command) {
            case 'tree':
                this.navigationController.switchToView('tree');
                break;
            case 'flows':
                this.navigationController.switchToView('flows');
                break;
            case 'search':
                if (this.navigationController.getCurrentView() === 'tree') {
                    document.getElementById('tree-search').focus();
                }
                break;
            case 'export':
                this.navigationController.exportData();
                break;
            case 'reset':
                this.navigationController.resetCurrentView();
                break;
            case 'help':
                this.showKeyboardHelp();
                break;
        }
    }

    trackEvent(eventName, data = {}) {
        // Simple event tracking
        console.log('Event:', eventName, {
            ...data,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId()
        });
    }

    getSessionId() {
        if (!this.sessionId) {
            this.sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
        }
        return this.sessionId;
    }

    // Public API methods
    getCurrentView() {
        return this.navigationController ? this.navigationController.getCurrentView() : null;
    }

    switchToView(viewName) {
        if (this.navigationController) {
            this.navigationController.switchToView(viewName);
        }
    }

    getNavigationController() {
        return this.navigationController;
    }

    isApplicationReady() {
        return this.isInitialized;
    }
}

// Initialize the application
let tradingEcosystemApp;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        tradingEcosystemApp = new TradingEcosystemPlatform();
    });
} else {
    tradingEcosystemApp = new TradingEcosystemPlatform();
}

// Make app globally available
window.TradingEcosystemApp = tradingEcosystemApp;
