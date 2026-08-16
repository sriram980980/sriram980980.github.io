// D3.js Mind Map Implementation
// This file handles the creation and rendering of the interactive mind map

class MindMap {
    constructor(containerId, data) {
        this.container = d3.select(containerId);
        this.data = data;
        this.width = 0;
        this.height = 0;
        this.svg = null;
        this.g = null;
        this.tree = null;
        this.root = null;
        this.nodes = null;
        this.links = null;
        this.zoom = null;
        this.currentHighlights = [];
        this.animationDuration = 750;
        
        this.init();
    }

    init() {
        this.setupDimensions();
        this.setupSVG();
        this.setupZoom();
        this.processData();
        this.render();
        this.setupEventListeners();
    }

    setupDimensions() {
        const containerNode = this.container.node();
        const rect = containerNode.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
    }

    setupSVG() {
        this.svg = this.container
            .attr('width', this.width)
            .attr('height', this.height);

        // Create main group for zooming/panning
        this.g = this.svg.append('g')
            .attr('class', 'mind-map-content');

        // Create groups for different layers
        this.linksGroup = this.g.append('g').attr('class', 'links');
        this.nodesGroup = this.g.append('g').attr('class', 'nodes');
        this.flowsGroup = this.g.append('g').attr('class', 'flows');
    }

    setupZoom() {
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 3])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });

        this.svg.call(this.zoom);
    }

    processData() {
        // Create tree layout
        this.tree = d3.tree()
            .size([this.height - 100, this.width - 200])
            .separation((a, b) => {
                return (a.parent === b.parent ? 1 : 2) / a.depth;
            });

        // Create hierarchy
        this.root = d3.hierarchy(this.data);
        this.root.x0 = this.height / 2;
        this.root.y0 = 0;

        // Collapse all children initially except first level
        this.root.children.forEach(this.collapse.bind(this));

        this.update(this.root);
    }

    collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(this.collapse.bind(this));
            d.children = null;
        }
    }

    expand(d) {
        if (d._children) {
            d.children = d._children;
            d._children = null;
        }
    }

    render() {
        this.update(this.root);
        this.centerView();
    }

    update(source) {
        // Compute the new tree layout
        const treeData = this.tree(this.root);
        this.nodes = treeData.descendants();
        this.links = treeData.descendants().slice(1);

        // Normalize for fixed-depth
        this.nodes.forEach(d => {
            d.y = d.depth * 200;
        });

        // Update nodes
        this.updateNodes(source);
        
        // Update links
        this.updateLinks(source);

        // Store the old positions for transition
        this.nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    updateNodes(source) {
        const nodeSelection = this.nodesGroup.selectAll('g.node')
            .data(this.nodes, d => d.id || (d.id = ++this.nodeIdCounter || 1));

        // Enter new nodes
        const nodeEnter = nodeSelection.enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${source.y0},${source.x0})`)
            .style('opacity', 0);

        // Add circles for nodes
        nodeEnter.append('circle')
            .attr('class', 'node-circle')
            .attr('r', 1e-6)
            .style('fill', d => this.getNodeColor(d))
            .style('stroke', d => d3.color(this.getNodeColor(d)).darker())
            .style('stroke-width', '2px')
            .style('cursor', 'pointer')
            .on('click', (event, d) => this.handleNodeClick(event, d))
            .on('mouseover', (event, d) => this.handleNodeMouseOver(event, d))
            .on('mouseout', (event, d) => this.handleNodeMouseOut(event, d));

        // Add text labels
        nodeEnter.append('text')
            .attr('class', d => `node-text level-${d.depth}`)
            .attr('dy', '.35em')
            .attr('x', d => d.children || d._children ? -15 : 15)
            .style('text-anchor', d => d.children || d._children ? 'end' : 'start')
            .style('fill', '#2c3e50')
            .text(d => d.data.name);

        // Add expand/collapse indicators
        nodeEnter.append('text')
            .attr('class', 'node-indicator')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('fill', '#fff')
            .style('pointer-events', 'none')
            .text(d => d._children ? '+' : (d.children ? '−' : ''));

        // Transition nodes to their new position
        const nodeUpdate = nodeEnter.merge(nodeSelection);

        nodeUpdate.transition()
            .duration(this.animationDuration)
            .attr('transform', d => `translate(${d.y},${d.x})`)
            .style('opacity', 1);

        nodeUpdate.select('circle')
            .transition()
            .duration(this.animationDuration)
            .attr('r', d => this.getNodeRadius(d))
            .style('fill', d => this.getNodeColor(d));

        nodeUpdate.select('.node-indicator')
            .text(d => d._children ? '+' : (d.children ? '−' : ''));

        // Exit nodes
        const nodeExit = nodeSelection.exit().transition()
            .duration(this.animationDuration)
            .attr('transform', d => `translate(${source.y},${source.x})`)
            .style('opacity', 0)
            .remove();

        nodeExit.select('circle')
            .attr('r', 1e-6);
    }

    updateLinks(source) {
        const linkSelection = this.linksGroup.selectAll('path.link')
            .data(this.links, d => d.id);

        // Enter new links
        const linkEnter = linkSelection.enter().insert('path', 'g')
            .attr('class', 'link')
            .attr('d', d => this.diagonal(source, source))
            .style('opacity', 0);

        // Transition links to their new position
        const linkUpdate = linkEnter.merge(linkSelection);

        linkUpdate.transition()
            .duration(this.animationDuration)
            .attr('d', d => this.diagonal(d, d.parent))
            .style('opacity', 1);

        // Exit links
        linkSelection.exit().transition()
            .duration(this.animationDuration)
            .attr('d', d => this.diagonal(source, source))
            .style('opacity', 0)
            .remove();
    }

    diagonal(s, d) {
        const path = `M ${s.y} ${s.x}
                     C ${(s.y + d.y) / 2} ${s.x},
                       ${(s.y + d.y) / 2} ${d.x},
                       ${d.y} ${d.x}`;
        return path;
    }

    getNodeColor(d) {
        if (d.depth === 0) return '#2c3e50'; // Root node
        return getCategoryColor(d.data.category);
    }

    getNodeRadius(d) {
        switch (d.depth) {
            case 0: return 20; // Root
            case 1: return 15; // Main categories
            case 2: return 12; // Sub-categories
            default: return 8;
        }
    }

    handleNodeClick(event, d) {
        if (d.children) {
            this.collapse(d);
        } else if (d._children) {
            this.expand(d);
        }
        this.update(d);
        
        // Emit custom event for other components
        this.container.node().dispatchEvent(new CustomEvent('nodeClick', {
            detail: { node: d, event: event }
        }));
    }

    handleNodeMouseOver(event, d) {
        // Highlight node
        d3.select(event.target)
            .transition()
            .duration(200)
            .attr('r', this.getNodeRadius(d) * 1.2)
            .style('filter', 'brightness(1.1)');

        // Show tooltip
        this.showTooltip(event, d);
    }

    handleNodeMouseOut(event, d) {
        // Remove highlight
        d3.select(event.target)
            .transition()
            .duration(200)
            .attr('r', this.getNodeRadius(d))
            .style('filter', 'none');

        // Hide tooltip
        this.hideTooltip();
    }

    showTooltip(event, d) {
        const tooltip = d3.select('#tooltip');
        const data = d.data;

        // Update tooltip content
        d3.select('#tooltip-title').text(data.name);
        d3.select('#tooltip-category')
            .text(data.category || 'root')
            .style('background-color', this.getNodeColor(d));
        d3.select('#tooltip-description').text(data.description || 'No description available');

        // Update attributes list
        const attributesList = d3.select('#tooltip-attributes');
        attributesList.selectAll('li').remove();
        if (data.attributes) {
            data.attributes.forEach(attr => {
                attributesList.append('li').text(attr);
            });
        }

        // Update data sources list
        const sourcesList = d3.select('#tooltip-sources');
        sourcesList.selectAll('li').remove();
        if (data.data_sources) {
            data.data_sources.forEach(source => {
                sourcesList.append('li').text(source);
            });
        }

        // Update lifecycle stages
        const lifecycleContainer = d3.select('#tooltip-lifecycle');
        lifecycleContainer.selectAll('.lifecycle-stage').remove();
        if (data.lifecycle) {
            data.lifecycle.forEach(stage => {
                lifecycleContainer.append('div')
                    .attr('class', 'lifecycle-stage')
                    .text(stage);
            });
        }

        // Position and show tooltip
        const [mouseX, mouseY] = d3.pointer(event, document.body);
        tooltip
            .style('left', (mouseX + 10) + 'px')
            .style('top', (mouseY - 10) + 'px')
            .classed('visible', true);
    }

    hideTooltip() {
        d3.select('#tooltip').classed('visible', false);
    }

    centerView() {
        const bounds = this.g.node().getBBox();
        const fullWidth = this.width;
        const fullHeight = this.height;
        const width = bounds.width;
        const height = bounds.height;
        const midX = bounds.x + width / 2;
        const midY = bounds.y + height / 2;

        if (width === 0 || height === 0) return; // Nothing to center

        const scale = 0.8 / Math.max(width / fullWidth, height / fullHeight);
        const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

        this.svg.transition()
            .duration(1000)
            .call(this.zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    }

    highlightNodes(nodeNames) {
        // Clear previous highlights
        this.clearHighlights();

        if (!nodeNames || nodeNames.length === 0) {
            return;
        }

        this.currentHighlights = nodeNames;

        // Highlight specified nodes
        this.nodesGroup.selectAll('.node')
            .each((d, i, nodes) => {
                const node = d3.select(nodes[i]);
                if (nodeNames.includes(d.data.name)) {
                    node.select('circle')
                        .transition()
                        .duration(500)
                        .style('stroke-width', '4px')
                        .style('stroke', '#f39c12')
                        .style('filter', 'brightness(1.2)');
                        
                    node.select('text')
                        .transition()
                        .duration(500)
                        .style('font-weight', 'bold')
                        .style('fill', '#e67e22');
                } else {
                    // Dim non-highlighted nodes
                    node.transition()
                        .duration(500)
                        .style('opacity', 0.3);
                }
            });
    }

    clearHighlights() {
        this.currentHighlights = [];
        
        this.nodesGroup.selectAll('.node')
            .transition()
            .duration(500)
            .style('opacity', 1);

        this.nodesGroup.selectAll('.node-circle')
            .transition()
            .duration(500)
            .style('stroke-width', '2px')
            .style('stroke', d => d3.color(this.getNodeColor(d)).darker())
            .style('filter', 'none');

        this.nodesGroup.selectAll('.node-text')
            .transition()
            .duration(500)
            .style('font-weight', d => d.depth <= 1 ? '600' : '500')
            .style('fill', '#2c3e50');
    }

    animateFlows(flowPaths) {
        // Remove existing flow animations
        this.flowsGroup.selectAll('.flow-arrow').remove();

        if (!flowPaths || flowPaths.length === 0) return;

        flowPaths.forEach((path, pathIndex) => {
            this.animateFlowPath(path, pathIndex * 1000);
        });
    }

    animateFlowPath(path, delay = 0) {
        for (let i = 0; i < path.length - 1; i++) {
            const sourceNode = this.findNodeByName(path[i]);
            const targetNode = this.findNodeByName(path[i + 1]);

            if (sourceNode && targetNode) {
                setTimeout(() => {
                    this.createFlowArrow(sourceNode, targetNode);
                }, delay + i * 500);
            }
        }
    }

    createFlowArrow(sourceNode, targetNode) {
        const sourceData = this.nodes.find(n => n.data.name === sourceNode.data.name);
        const targetData = this.nodes.find(n => n.data.name === targetNode.data.name);

        if (!sourceData || !targetData) return;

        // Create arrow marker if it doesn't exist
        let defs = this.svg.select('defs');
        if (defs.empty()) {
            defs = this.svg.append('defs');
        }

        if (defs.select('#arrow-marker').empty()) {
            defs.append('marker')
                .attr('id', 'arrow-marker')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 8)
                .attr('refY', 0)
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5')
                .attr('class', 'flow-arrow')
                .style('fill', '#3498db');
        }

        // Create animated path
        const line = this.flowsGroup.append('path')
            .attr('class', 'link highlighted')
            .attr('marker-end', 'url(#arrow-marker)')
            .attr('d', this.diagonal(sourceData, targetData))
            .style('opacity', 0);

        line.transition()
            .duration(1000)
            .style('opacity', 1)
            .transition()
            .delay(3000)
            .duration(1000)
            .style('opacity', 0)
            .remove();
    }

    findNodeByName(name) {
        return findNodeByName(this.data, name);
    }

    expandAll() {
        this.expandAllNodes(this.root);
        this.update(this.root);
    }

    collapseAll() {
        this.root.children.forEach(this.collapse.bind(this));
        this.update(this.root);
    }

    expandAllNodes(d) {
        if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        if (d.children) {
            d.children.forEach(this.expandAllNodes.bind(this));
        }
    }

    resetView() {
        this.collapseAll();
        this.clearHighlights();
        this.flowsGroup.selectAll('.flow-arrow').remove();
        this.centerView();
    }

    setupEventListeners() {
        // Listen for window resize
        window.addEventListener('resize', () => {
            this.setupDimensions();
            this.svg.attr('width', this.width).attr('height', this.height);
            this.tree.size([this.height - 100, this.width - 200]);
            this.update(this.root);
        });
    }
}

// Export for use in other modules
window.MindMap = MindMap;
