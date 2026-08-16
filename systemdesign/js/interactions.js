// Interactions Module
// This file handles user interactions, tooltips, and advanced interactivity features

class InteractionManager {
    constructor(mindMap, slideSystem) {
        this.mindMap = mindMap;
        this.slideSystem = slideSystem;
        this.tooltip = document.getElementById('tooltip');
        this.isTooltipVisible = false;
        this.tooltipTimeout = null;
        this.searchTimeout = null;
        
        this.init();
    }

    init() {
        this.setupTooltipInteractions();
        this.setupKeyboardNavigation();
        this.setupSearchFunctionality();
        this.setupContextualHelp();
        this.setupAccessibilityFeatures();
    }

    setupTooltipInteractions() {
        // Enhanced tooltip with rich content
        this.mindMap.container.on('mouseover', '.node-circle', (event, d) => {
            this.showEnhancedTooltip(event, d);
        });

        this.mindMap.container.on('mouseout', '.node-circle', () => {
            this.hideTooltipWithDelay();
        });

        // Keep tooltip visible when hovering over it
        this.tooltip.addEventListener('mouseenter', () => {
            this.cancelTooltipHide();
        });

        this.tooltip.addEventListener('mouseleave', () => {
            this.hideTooltipWithDelay();
        });

        // Click to pin tooltip
        this.mindMap.container.on('click', '.node-circle', (event, d) => {
            if (event.shiftKey) {
                this.pinTooltip(event, d);
            }
        });
    }

    showEnhancedTooltip(event, d) {
        this.cancelTooltipHide();
        
        const data = d.data;
        
        // Update tooltip content with rich formatting
        this.updateTooltipHeader(data);
        this.updateTooltipDescription(data);
        this.updateTooltipAttributes(data);
        this.updateTooltipDataSources(data);
        this.updateTooltipLifecycle(data);
        this.updateTooltipConnections(d);

        this.positionTooltip(event);
        this.showTooltip();
    }

    updateTooltipHeader(data) {
        document.getElementById('tooltip-title').textContent = data.name;
        
        const categoryElement = document.getElementById('tooltip-category');
        categoryElement.textContent = data.category || 'root';
        categoryElement.style.backgroundColor = getCategoryColor(data.category);
    }

    updateTooltipDescription(data) {
        const description = data.description || 'No description available';
        document.getElementById('tooltip-description').textContent = description;
    }

    updateTooltipAttributes(data) {
        const attributesList = document.getElementById('tooltip-attributes');
        attributesList.innerHTML = '';
        
        if (data.attributes && data.attributes.length > 0) {
            data.attributes.forEach(attr => {
                const li = document.createElement('li');
                li.textContent = attr;
                attributesList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No specific attributes defined';
            li.style.fontStyle = 'italic';
            attributesList.appendChild(li);
        }
    }

    updateTooltipDataSources(data) {
        const sourcesList = document.getElementById('tooltip-sources');
        sourcesList.innerHTML = '';
        
        if (data.data_sources && data.data_sources.length > 0) {
            data.data_sources.forEach(source => {
                const li = document.createElement('li');
                li.textContent = source;
                sourcesList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No data sources specified';
            li.style.fontStyle = 'italic';
            sourcesList.appendChild(li);
        }
    }

    updateTooltipLifecycle(data) {
        const lifecycleContainer = document.getElementById('tooltip-lifecycle');
        lifecycleContainer.innerHTML = '';
        
        if (data.lifecycle && data.lifecycle.length > 0) {
            data.lifecycle.forEach((stage, index) => {
                const stageElement = document.createElement('div');
                stageElement.className = 'lifecycle-stage';
                stageElement.textContent = stage;
                
                // Add active state for demonstration
                if (index === 0 || Math.random() > 0.7) {
                    stageElement.classList.add('active');
                }
                
                lifecycleContainer.appendChild(stageElement);
            });
        } else {
            const stageElement = document.createElement('div');
            stageElement.className = 'lifecycle-stage';
            stageElement.textContent = 'No lifecycle defined';
            stageElement.style.fontStyle = 'italic';
            lifecycleContainer.appendChild(stageElement);
        }
    }

    updateTooltipConnections(d) {
        // Add section for showing connections to other nodes
        let connectionsSection = this.tooltip.querySelector('.tooltip-connections');
        if (!connectionsSection) {
            connectionsSection = document.createElement('div');
            connectionsSection.className = 'tooltip-section tooltip-connections';
            connectionsSection.innerHTML = '<strong>Related Components:</strong><div class="connections-list"></div>';
            this.tooltip.querySelector('.tooltip-content').appendChild(connectionsSection);
        }

        const connectionsList = connectionsSection.querySelector('.connections-list');
        connectionsList.innerHTML = '';

        // Find related nodes based on category or parent-child relationships
        const relatedNodes = this.findRelatedNodes(d);
        
        if (relatedNodes.length > 0) {
            relatedNodes.slice(0, 3).forEach(node => {
                const connectionItem = document.createElement('div');
                connectionItem.className = 'connection-item';
                connectionItem.innerHTML = `
                    <span class="connection-name">${node.data.name}</span>
                    <span class="connection-type">${this.getRelationType(d, node)}</span>
                `;
                connectionItem.style.cursor = 'pointer';
                connectionItem.addEventListener('click', () => {
                    this.highlightConnection(d, node);
                });
                connectionsList.appendChild(connectionItem);
            });
        } else {
            connectionsList.innerHTML = '<span style="font-style: italic;">No direct connections</span>';
        }
    }

    findRelatedNodes(targetNode) {
        const allNodes = [];
        this.getAllNodesFromHierarchy(this.mindMap.root, allNodes);
        
        return allNodes.filter(node => {
            if (node === targetNode) return false;
            
            // Same category
            if (node.data.category === targetNode.data.category) return true;
            
            // Parent-child relationship
            if (node.parent === targetNode || targetNode.parent === node) return true;
            
            // Sibling relationship
            if (node.parent === targetNode.parent && node.parent) return true;
            
            return false;
        });
    }

    getAllNodesFromHierarchy(node, result) {
        result.push(node);
        if (node.children) {
            node.children.forEach(child => this.getAllNodesFromHierarchy(child, result));
        }
        if (node._children) {
            node._children.forEach(child => this.getAllNodesFromHierarchy(child, result));
        }
    }

    getRelationType(node1, node2) {
        if (node1.parent === node2) return 'Child of';
        if (node2.parent === node1) return 'Parent of';
        if (node1.parent === node2.parent && node1.parent) return 'Sibling';
        if (node1.data.category === node2.data.category) return 'Same category';
        return 'Related';
    }

    highlightConnection(node1, node2) {
        this.mindMap.highlightNodes([node1.data.name, node2.data.name]);
        
        // Create a flow animation between the nodes
        setTimeout(() => {
            this.mindMap.animateFlows([[node1.data.name, node2.data.name]]);
        }, 500);
    }

    positionTooltip(event) {
        const [mouseX, mouseY] = d3.pointer(event, document.body);
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let left = mouseX + 15;
        let top = mouseY - 10;

        // Adjust if tooltip would go off screen
        if (left + tooltipRect.width > windowWidth) {
            left = mouseX - tooltipRect.width - 15;
        }
        
        if (top + tooltipRect.height > windowHeight) {
            top = mouseY - tooltipRect.height - 10;
        }

        this.tooltip.style.left = left + 'px';
        this.tooltip.style.top = Math.max(10, top) + 'px';
    }

    showTooltip() {
        this.tooltip.classList.add('visible');
        this.isTooltipVisible = true;
    }

    hideTooltipWithDelay() {
        this.tooltipTimeout = setTimeout(() => {
            this.hideTooltip();
        }, 300);
    }

    hideTooltip() {
        this.tooltip.classList.remove('visible');
        this.isTooltipVisible = false;
    }

    cancelTooltipHide() {
        if (this.tooltipTimeout) {
            clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = null;
        }
    }

    pinTooltip(event, d) {
        this.showEnhancedTooltip(event, d);
        this.cancelTooltipHide();
        
        // Add pin indicator
        this.tooltip.classList.add('pinned');
        
        // Add close button if not exists
        let closeBtn = this.tooltip.querySelector('.tooltip-close');
        if (!closeBtn) {
            closeBtn = document.createElement('button');
            closeBtn.className = 'tooltip-close';
            closeBtn.innerHTML = '×';
            closeBtn.title = 'Close tooltip';
            closeBtn.addEventListener('click', () => {
                this.unpinTooltip();
            });
            this.tooltip.querySelector('.tooltip-header').appendChild(closeBtn);
        }
    }

    unpinTooltip() {
        this.tooltip.classList.remove('pinned');
        const closeBtn = this.tooltip.querySelector('.tooltip-close');
        if (closeBtn) {
            closeBtn.remove();
        }
        this.hideTooltip();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            // Only handle when not in an input field
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            switch(event.key) {
                case 'f':
                case 'F':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        this.showSearchInterface();
                    }
                    break;
                case 'h':
                case 'H':
                    event.preventDefault();
                    this.showKeyboardHelp();
                    break;
                case 'r':
                case 'R':
                    event.preventDefault();
                    this.mindMap.resetView();
                    break;
                case 'e':
                case 'E':
                    event.preventDefault();
                    this.mindMap.expandAll();
                    break;
                case 'c':
                case 'C':
                    event.preventDefault();
                    this.mindMap.collapseAll();
                    break;
            }
        });
    }

    setupSearchFunctionality() {
        // Create search interface
        this.createSearchInterface();
    }

    createSearchInterface() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" id="node-search" placeholder="Search nodes... (Ctrl+F)" />
                <button id="search-btn">🔍</button>
                <button id="clear-search">✕</button>
            </div>
            <div class="search-results" id="search-results"></div>
        `;
        
        document.querySelector('.mind-map-container').appendChild(searchContainer);

        const searchInput = document.getElementById('node-search');
        const searchBtn = document.getElementById('search-btn');
        const clearBtn = document.getElementById('clear-search');
        const resultsContainer = document.getElementById('search-results');

        searchInput.addEventListener('input', (event) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.performSearch(event.target.value);
            }, 300);
        });

        searchBtn.addEventListener('click', () => {
            this.performSearch(searchInput.value);
        });

        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            resultsContainer.innerHTML = '';
            this.mindMap.clearHighlights();
            this.hideSearchInterface();
        });

        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.hideSearchInterface();
            }
        });
    }

    showSearchInterface() {
        const searchContainer = document.querySelector('.search-container');
        searchContainer.classList.add('visible');
        document.getElementById('node-search').focus();
    }

    hideSearchInterface() {
        const searchContainer = document.querySelector('.search-container');
        searchContainer.classList.remove('visible');
    }

    performSearch(query) {
        if (!query || query.length < 2) {
            document.getElementById('search-results').innerHTML = '';
            this.mindMap.clearHighlights();
            return;
        }

        const allNodes = [];
        this.getAllNodesFromHierarchy(this.mindMap.root, allNodes);
        
        const matches = allNodes.filter(node => {
            const name = node.data.name.toLowerCase();
            const description = (node.data.description || '').toLowerCase();
            const searchTerm = query.toLowerCase();
            
            return name.includes(searchTerm) || description.includes(searchTerm);
        });

        this.displaySearchResults(matches, query);
        
        if (matches.length > 0) {
            const matchNames = matches.map(node => node.data.name);
            this.mindMap.highlightNodes(matchNames);
        }
    }

    displaySearchResults(matches, query) {
        const resultsContainer = document.getElementById('search-results');
        
        if (matches.length === 0) {
            resultsContainer.innerHTML = `<div class="search-no-results">No results found for "${query}"</div>`;
            return;
        }

        resultsContainer.innerHTML = `
            <div class="search-header">${matches.length} result${matches.length > 1 ? 's' : ''} found:</div>
            ${matches.map(node => `
                <div class="search-result-item" data-node-name="${node.data.name}">
                    <div class="search-result-name">${this.highlightSearchTerm(node.data.name, query)}</div>
                    <div class="search-result-description">${this.highlightSearchTerm(node.data.description || '', query)}</div>
                    <div class="search-result-category">${node.data.category || 'root'}</div>
                </div>
            `).join('')}
        `;

        // Add click handlers for search results
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const nodeName = item.dataset.nodeName;
                this.focusOnNode(nodeName);
            });
        });
    }

    highlightSearchTerm(text, term) {
        if (!text || !term) return text;
        
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    focusOnNode(nodeName) {
        const node = this.findHierarchyNodeByName(this.mindMap.root, nodeName);
        if (node) {
            // Expand path to node
            this.expandPathToNode(node);
            this.mindMap.update(this.mindMap.root);
            
            // Highlight the node
            setTimeout(() => {
                this.mindMap.highlightNodes([nodeName]);
            }, 500);
        }
    }

    findHierarchyNodeByName(hierarchyNode, name) {
        if (hierarchyNode.data.name === name) {
            return hierarchyNode;
        }
        
        if (hierarchyNode.children) {
            for (let child of hierarchyNode.children) {
                const found = this.findHierarchyNodeByName(child, name);
                if (found) return found;
            }
        }
        
        if (hierarchyNode._children) {
            for (let child of hierarchyNode._children) {
                const found = this.findHierarchyNodeByName(child, name);
                if (found) return found;
            }
        }
        
        return null;
    }

    expandPathToNode(node) {
        let current = node.parent;
        while (current) {
            if (current._children) {
                current.children = current._children;
                current._children = null;
            }
            current = current.parent;
        }
    }

    setupContextualHelp() {
        // Create help overlay
        this.createHelpOverlay();
    }

    createHelpOverlay() {
        const helpOverlay = document.createElement('div');
        helpOverlay.id = 'help-overlay';
        helpOverlay.className = 'help-overlay';
        helpOverlay.innerHTML = `
            <div class="help-content">
                <div class="help-header">
                    <h3>Keyboard Shortcuts & Help</h3>
                    <button class="help-close">×</button>
                </div>
                <div class="help-sections">
                    <div class="help-section">
                        <h4>Navigation</h4>
                        <div class="help-shortcut"><kbd>←</kbd> <kbd>→</kbd> Navigate slides</div>
                        <div class="help-shortcut"><kbd>Space</kbd> Next slide</div>
                        <div class="help-shortcut"><kbd>Home</kbd> First slide</div>
                        <div class="help-shortcut"><kbd>End</kbd> Last slide</div>
                        <div class="help-shortcut"><kbd>Esc</kbd> Exit guided mode</div>
                    </div>
                    <div class="help-section">
                        <h4>Mind Map</h4>
                        <div class="help-shortcut"><kbd>Click</kbd> Expand/collapse node</div>
                        <div class="help-shortcut"><kbd>Shift+Click</kbd> Pin tooltip</div>
                        <div class="help-shortcut"><kbd>Mouse wheel</kbd> Zoom in/out</div>
                        <div class="help-shortcut"><kbd>Drag</kbd> Pan view</div>
                    </div>
                    <div class="help-section">
                        <h4>Actions</h4>
                        <div class="help-shortcut"><kbd>Ctrl+F</kbd> Search nodes</div>
                        <div class="help-shortcut"><kbd>R</kbd> Reset view</div>
                        <div class="help-shortcut"><kbd>E</kbd> Expand all</div>
                        <div class="help-shortcut"><kbd>C</kbd> Collapse all</div>
                        <div class="help-shortcut"><kbd>H</kbd> Show this help</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(helpOverlay);

        helpOverlay.querySelector('.help-close').addEventListener('click', () => {
            this.hideKeyboardHelp();
        });

        helpOverlay.addEventListener('click', (event) => {
            if (event.target === helpOverlay) {
                this.hideKeyboardHelp();
            }
        });
    }

    showKeyboardHelp() {
        document.getElementById('help-overlay').classList.add('visible');
    }

    hideKeyboardHelp() {
        document.getElementById('help-overlay').classList.remove('visible');
    }

    setupAccessibilityFeatures() {
        // Add ARIA labels and roles
        this.enhanceAccessibility();
    }

    enhanceAccessibility() {
        // Add ARIA labels to interactive elements
        const mindMapSvg = document.getElementById('mind-map');
        mindMapSvg.setAttribute('role', 'application');
        mindMapSvg.setAttribute('aria-label', 'Interactive trading ecosystem mind map');

        // Add focus management
        this.setupFocusManagement();
    }

    setupFocusManagement() {
        // Make SVG elements focusable and add keyboard interaction
        this.mindMap.nodesGroup.selectAll('.node-circle')
            .attr('tabindex', '0')
            .attr('role', 'button')
            .attr('aria-label', d => `${d.data.name} - ${d.data.description || 'Node in trading ecosystem'}`);
    }
}

// Export for use in other modules
window.InteractionManager = InteractionManager;
