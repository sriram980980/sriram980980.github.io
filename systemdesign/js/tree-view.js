// Tree View Component
// Handles the 80% tree navigation and 20% details panel

class TreeView {
    constructor(data) {
        this.data = data;
        this.selectedNode = null;
        this.expandedNodes = new Set();
        this.filteredData = null;
        
        this.init();
    }

    init() {
        this.renderTree();
        this.setupEventListeners();
        this.showWelcomeMessage();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('tree-search');
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Control buttons
        document.getElementById('expand-all').addEventListener('click', () => {
            this.expandAll();
        });

        document.getElementById('collapse-all').addEventListener('click', () => {
            this.collapseAll();
        });

        document.getElementById('close-details').addEventListener('click', () => {
            this.clearSelection();
        });
    }

    renderTree() {
        const treeContent = document.getElementById('tree-content');
        treeContent.innerHTML = '';
        
        const treeHtml = this.createTreeNode(this.filteredData || this.data, 0);
        treeContent.innerHTML = treeHtml;
        
        this.attachTreeEventListeners();
    }

    createTreeNode(node, level) {
        const nodeId = this.generateNodeId(node.name);
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = this.expandedNodes.has(nodeId);
        const isSelected = this.selectedNode && this.selectedNode.name === node.name;

        let html = `
            <div class="tree-node" data-category="${node.category || 'root'}" data-node-id="${nodeId}">
                <div class="tree-node-header ${isSelected ? 'selected' : ''}" data-node-name="${node.name}">
                    ${hasChildren ? `
                        <button class="tree-node-toggle" data-node-id="${nodeId}">
                            ${isExpanded ? '−' : '+'}
                        </button>
                    ` : '<span class="tree-node-toggle"></span>'}
                    
                    <div class="tree-node-icon">
                        ${this.getNodeIcon(node)}
                    </div>
                    
                    <div class="tree-node-content">
                        <div class="tree-node-title">${node.name}</div>
                        <div class="tree-node-description">${node.description || ''}</div>
                    </div>
                </div>
        `;

        if (hasChildren) {
            html += `<div class="tree-node-children ${isExpanded ? 'expanded' : ''}" data-parent-id="${nodeId}">`;
            
            for (const child of node.children) {
                html += this.createTreeNode(child, level + 1);
            }
            
            html += '</div>';
        }

        html += '</div>';
        return html;
    }

    getNodeIcon(node) {
        const icons = {
            'root': '🏛️',
            'instruments': '📈',
            'funds': '💼',
            'positions': '👥',
            'infrastructure': '🏗️',
            'lifecycle': '🔄',
            'performance': '📊',
            'risk': '⚠️',
            'flows': '💰',
            'regulatory': '⚖️',
            'participants': '🤝'
        };
        
        const category = node.category || 'root';
        return icons[category] || '📄';
    }

    generateNodeId(name) {
        return name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    }

    attachTreeEventListeners() {
        // Toggle expand/collapse
        document.querySelectorAll('.tree-node-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const nodeId = toggle.dataset.nodeId;
                if (nodeId) {
                    this.toggleNode(nodeId);
                }
            });
        });

        // Node selection
        document.querySelectorAll('.tree-node-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const nodeName = header.dataset.nodeName;
                const node = this.findNodeByName(this.data, nodeName);
                if (node) {
                    this.selectNode(node);
                }
            });

            // Hover effect for quick preview
            header.addEventListener('mouseenter', (e) => {
                const nodeName = header.dataset.nodeName;
                const node = this.findNodeByName(this.data, nodeName);
                if (node && !this.selectedNode) {
                    this.showQuickPreview(node);
                }
            });
        });
    }

    toggleNode(nodeId) {
        if (this.expandedNodes.has(nodeId)) {
            this.expandedNodes.delete(nodeId);
        } else {
            this.expandedNodes.add(nodeId);
        }
        
        this.updateNodeVisibility(nodeId);
    }

    updateNodeVisibility(nodeId) {
        const childrenContainer = document.querySelector(`[data-parent-id="${nodeId}"]`);
        const toggle = document.querySelector(`[data-node-id="${nodeId}"]`);
        
        if (childrenContainer && toggle) {
            const isExpanded = this.expandedNodes.has(nodeId);
            
            if (isExpanded) {
                childrenContainer.classList.add('expanded');
                toggle.textContent = '−';
            } else {
                childrenContainer.classList.remove('expanded');
                toggle.textContent = '+';
            }
        }
    }

    expandAll() {
        this.collectAllNodeIds(this.data).forEach(nodeId => {
            this.expandedNodes.add(nodeId);
        });
        this.renderTree();
    }

    collapseAll() {
        this.expandedNodes.clear();
        this.renderTree();
    }

    collectAllNodeIds(node) {
        const ids = [];
        
        if (node.children && node.children.length > 0) {
            const nodeId = this.generateNodeId(node.name);
            ids.push(nodeId);
            
            node.children.forEach(child => {
                ids.push(...this.collectAllNodeIds(child));
            });
        }
        
        return ids;
    }

    selectNode(node) {
        // Clear previous selection
        document.querySelectorAll('.tree-node-header.selected').forEach(header => {
            header.classList.remove('selected');
        });

        // Set new selection
        this.selectedNode = node;
        const nodeId = this.generateNodeId(node.name);
        const header = document.querySelector(`[data-node-name="${node.name}"]`);
        if (header) {
            header.classList.add('selected');
        }

        // Show details
        this.showNodeDetails(node);
    }

    clearSelection() {
        document.querySelectorAll('.tree-node-header.selected').forEach(header => {
            header.classList.remove('selected');
        });
        this.selectedNode = null;
        this.showWelcomeMessage();
    }

    showNodeDetails(node) {
        const detailsContent = document.getElementById('details-content');
        
        const categoryColor = getCategoryColor(node.category);
        
        detailsContent.innerHTML = `
            <div class="entity-details">
                <div class="entity-header">
                    <div class="entity-title">${node.name}</div>
                    <div class="entity-category" style="background: ${categoryColor};">
                        ${node.category || 'root'}
                    </div>
                    <div class="entity-description">
                        ${node.description || 'No description available'}
                    </div>
                </div>

                ${node.attributes && node.attributes.length > 0 ? `
                    <div class="entity-section">
                        <div class="section-title">
                            <span class="section-icon">🏷️</span>
                            Key Attributes
                        </div>
                        <ul class="attribute-list">
                            ${node.attributes.map(attr => `
                                <li class="attribute-item">${attr}</li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${node.data_sources && node.data_sources.length > 0 ? `
                    <div class="entity-section">
                        <div class="section-title">
                            <span class="section-icon">📡</span>
                            Data Sources
                        </div>
                        <ul class="source-list">
                            ${node.data_sources.map(source => `
                                <li class="source-item">${source}</li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${node.lifecycle && node.lifecycle.length > 0 ? `
                    <div class="entity-section">
                        <div class="section-title">
                            <span class="section-icon">🔄</span>
                            Lifecycle Stages
                        </div>
                        <div class="lifecycle-container">
                            ${node.lifecycle.map(stage => `
                                <div class="lifecycle-step">${stage}</div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${node.children && node.children.length > 0 ? `
                    <div class="entity-section">
                        <div class="section-title">
                            <span class="section-icon">🌿</span>
                            Components (${node.children.length})
                        </div>
                        <ul class="source-list">
                            ${node.children.map(child => `
                                <li class="source-item" style="cursor: pointer;" onclick="treeView.selectNodeByName('${child.name}')">
                                    ${this.getNodeIcon(child)} ${child.name}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }

    showQuickPreview(node) {
        // Only show if no node is currently selected
        if (this.selectedNode) return;
        
        const detailsContent = document.getElementById('details-content');
        const categoryColor = getCategoryColor(node.category);
        
        detailsContent.innerHTML = `
            <div class="entity-details" style="opacity: 0.7;">
                <div class="entity-header">
                    <div class="entity-title">${node.name}</div>
                    <div class="entity-category" style="background: ${categoryColor};">
                        ${node.category || 'root'}
                    </div>
                    <div class="entity-description">
                        ${node.description || 'No description available'}
                    </div>
                </div>
                <div style="text-align: center; padding: 20px; color: #666; font-style: italic;">
                    Click to view full details
                </div>
            </div>
        `;
    }

    showWelcomeMessage() {
        const detailsContent = document.getElementById('details-content');
        detailsContent.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">🏛️</div>
                <h4>Trading Ecosystem Explorer</h4>
                <p>Select any component from the tree to view detailed information including attributes, data sources, and lifecycle stages.</p>
                <div class="quick-tips">
                    <h5>Quick Tips:</h5>
                    <ul>
                        <li>Click <strong>+</strong> or <strong>-</strong> to expand/collapse categories</li>
                        <li>Use the search bar to find specific components</li>
                        <li>Hover over items for quick preview</li>
                        <li>Use 📂 and 📁 buttons to expand/collapse all</li>
                    </ul>
                </div>
            </div>
        `;
    }

    selectNodeByName(nodeName) {
        const node = this.findNodeByName(this.data, nodeName);
        if (node) {
            this.selectNode(node);
            
            // Ensure the node is visible (expand parent if needed)
            this.expandToNode(nodeName);
        }
    }

    expandToNode(nodeName) {
        const path = this.findNodePath(this.data, nodeName);
        path.forEach(node => {
            const nodeId = this.generateNodeId(node.name);
            this.expandedNodes.add(nodeId);
        });
        this.renderTree();
    }

    findNodePath(node, targetName, path = []) {
        if (node.name === targetName) {
            return [...path, node];
        }

        if (node.children) {
            for (const child of node.children) {
                const found = this.findNodePath(child, targetName, [...path, node]);
                if (found) return found;
            }
        }

        return null;
    }

    handleSearch(query) {
        if (!query || query.length < 2) {
            this.filteredData = null;
            this.renderTree();
            return;
        }

        this.filteredData = this.filterNodes(this.data, query.toLowerCase());
        this.renderTree();
        
        // Auto-expand search results
        if (this.filteredData) {
            this.collectAllNodeIds(this.filteredData).forEach(nodeId => {
                this.expandedNodes.add(nodeId);
            });
            this.renderTree();
        }
    }

    filterNodes(node, query) {
        const matches = 
            node.name.toLowerCase().includes(query) ||
            (node.description && node.description.toLowerCase().includes(query)) ||
            (node.attributes && node.attributes.some(attr => attr.toLowerCase().includes(query)));

        let filteredChildren = [];
        if (node.children) {
            filteredChildren = node.children
                .map(child => this.filterNodes(child, query))
                .filter(child => child !== null);
        }

        if (matches || filteredChildren.length > 0) {
            return {
                ...node,
                children: filteredChildren
            };
        }

        return null;
    }

    findNodeByName(node, name) {
        if (node.name === name) {
            return node;
        }

        if (node.children) {
            for (const child of node.children) {
                const found = this.findNodeByName(child, name);
                if (found) return found;
            }
        }

        return null;
    }

    // Public API methods
    getSelectedNode() {
        return this.selectedNode;
    }

    refresh() {
        this.renderTree();
    }

    exportTreeData() {
        return {
            selectedNode: this.selectedNode,
            expandedNodes: Array.from(this.expandedNodes),
            data: this.data
        };
    }
}

// Export for global use
window.TreeView = TreeView;
