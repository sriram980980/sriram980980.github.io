// Slide System for Guided Tour
// This file manages the slideshow functionality and progressive disclosure

class SlideSystem {
    constructor(mindMap) {
        this.mindMap = mindMap;
        this.currentSlide = 1;
        this.totalSlides = SLIDE_CONTENT.length;
        this.isPlaying = false;
        this.playInterval = null;
        this.autoPlayDelay = 8000; // 8 seconds between slides
        this.isGuidedMode = true;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSlideDisplay();
        this.showSlideContent();
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prev-slide').addEventListener('click', () => {
            this.previousSlide();
        });

        document.getElementById('next-slide').addEventListener('click', () => {
            this.nextSlide();
        });

        document.getElementById('play-pause').addEventListener('click', () => {
            this.toggleAutoPlay();
        });

        // Mode toggle buttons
        document.getElementById('guided-mode').addEventListener('click', () => {
            this.setGuidedMode(true);
        });

        document.getElementById('free-mode').addEventListener('click', () => {
            this.setGuidedMode(false);
        });

        document.getElementById('reset-view').addEventListener('click', () => {
            this.resetToSlide1();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (!this.isGuidedMode) return;
            
            switch(event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case ' ':
                    event.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    event.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    event.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                case 'Escape':
                    event.preventDefault();
                    this.setGuidedMode(false);
                    break;
            }
        });
    }

    setGuidedMode(enabled) {
        this.isGuidedMode = enabled;
        
        const slideNavigation = document.getElementById('slide-navigation');
        const slidePanel = document.getElementById('slide-panel');
        const guidedBtn = document.getElementById('guided-mode');
        const freeBtn = document.getElementById('free-mode');

        if (enabled) {
            slideNavigation.classList.remove('hidden');
            slidePanel.classList.remove('hidden');
            guidedBtn.classList.add('active');
            freeBtn.classList.remove('active');
            this.showSlideContent();
        } else {
            slideNavigation.classList.add('hidden');
            slidePanel.classList.add('hidden');
            guidedBtn.classList.remove('active');
            freeBtn.classList.add('active');
            this.mindMap.clearHighlights();
            this.mindMap.flowsGroup.selectAll('*').remove();
            this.stopAutoPlay();
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.currentSlide++;
            this.updateSlideDisplay();
            this.showSlideContent();
        } else {
            // End of slides, stop autoplay
            this.stopAutoPlay();
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.currentSlide--;
            this.updateSlideDisplay();
            this.showSlideContent();
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
            this.currentSlide = slideNumber;
            this.updateSlideDisplay();
            this.showSlideContent();
        }
    }

    updateSlideDisplay() {
        // Update progress bar
        const progressFill = document.getElementById('progress-fill');
        const progressPercent = (this.currentSlide / this.totalSlides) * 100;
        progressFill.style.width = progressPercent + '%';

        // Update slide counter
        document.getElementById('slide-counter').textContent = 
            `${this.currentSlide} / ${this.totalSlides}`;

        // Update navigation buttons
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        
        prevBtn.disabled = this.currentSlide === 1;
        nextBtn.disabled = this.currentSlide === this.totalSlides;
        
        if (this.currentSlide === this.totalSlides) {
            nextBtn.textContent = 'Finish';
        } else {
            nextBtn.textContent = 'Next';
        }
    }

    showSlideContent() {
        if (!this.isGuidedMode) return;

        const slideContent = getSlideContent(this.currentSlide);
        
        // Update slide content
        this.updateSlideText(slideContent);
        
        // Highlight relevant nodes with animation
        this.highlightSlideNodes(slideContent);
        
        // Show flow animations
        this.animateSlideFlows(slideContent);
        
        // Expand relevant nodes
        this.expandSlideNodes(slideContent);
    }

    updateSlideText(slideContent) {
        // Animate text changes
        const titleElement = document.getElementById('slide-title');
        const descriptionElement = document.getElementById('slide-description');
        const highlightsElement = document.getElementById('slide-highlights');

        // Fade out current content
        titleElement.style.opacity = '0';
        descriptionElement.style.opacity = '0';
        highlightsElement.style.opacity = '0';

        setTimeout(() => {
            // Update content
            titleElement.textContent = slideContent.title;
            descriptionElement.textContent = slideContent.description;
            
            // Update highlights
            highlightsElement.innerHTML = '';
            slideContent.highlights.forEach(highlight => {
                const tag = document.createElement('div');
                tag.className = 'highlight-tag';
                tag.textContent = highlight;
                highlightsElement.appendChild(tag);
            });

            // Fade in new content
            titleElement.style.opacity = '1';
            descriptionElement.style.opacity = '1';
            highlightsElement.style.opacity = '1';
        }, 200);
    }

    highlightSlideNodes(slideContent) {
        // Clear previous highlights
        this.mindMap.clearHighlights();
        
        // Highlight nodes for this slide
        if (slideContent.focusNodes && slideContent.focusNodes.length > 0) {
            setTimeout(() => {
                this.mindMap.highlightNodes(slideContent.focusNodes);
            }, 300);
        }
    }

    animateSlideFlows(slideContent) {
        // Clear previous flows
        this.mindMap.flowsGroup.selectAll('*').remove();
        
        // Animate flows for this slide
        if (slideContent.flowPaths && slideContent.flowPaths.length > 0) {
            setTimeout(() => {
                this.mindMap.animateFlows(slideContent.flowPaths);
            }, 800);
        }
    }

    expandSlideNodes(slideContent) {
        if (!slideContent.focusNodes || slideContent.focusNodes.length === 0) {
            return;
        }

        // Expand nodes that should be visible for this slide
        slideContent.focusNodes.forEach(nodeName => {
            const node = this.findHierarchyNode(this.mindMap.root, nodeName);
            if (node) {
                // Expand parent nodes to make this node visible
                this.expandPathToNode(node);
            }
        });

        // Update the mind map
        setTimeout(() => {
            this.mindMap.update(this.mindMap.root);
        }, 100);
    }

    findHierarchyNode(hierarchyNode, name) {
        if (hierarchyNode.data.name === name) {
            return hierarchyNode;
        }
        
        if (hierarchyNode.children) {
            for (let child of hierarchyNode.children) {
                const found = this.findHierarchyNode(child, name);
                if (found) return found;
            }
        }
        
        if (hierarchyNode._children) {
            for (let child of hierarchyNode._children) {
                const found = this.findHierarchyNode(child, name);
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

    toggleAutoPlay() {
        if (this.isPlaying) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }

    startAutoPlay() {
        this.isPlaying = true;
        document.getElementById('play-pause').textContent = 'Pause';
        
        this.playInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides) {
                this.nextSlide();
            } else {
                this.stopAutoPlay();
            }
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        this.isPlaying = false;
        document.getElementById('play-pause').textContent = 'Play';
        
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
    }

    resetToSlide1() {
        this.stopAutoPlay();
        this.goToSlide(1);
        this.mindMap.resetView();
    }

    // Animation utilities
    createSlideTransition() {
        // Add subtle transition effects between slides
        const slidePanel = document.getElementById('slide-panel');
        slidePanel.style.transform = 'translateX(-20px)';
        slidePanel.style.opacity = '0.8';
        
        setTimeout(() => {
            slidePanel.style.transform = 'translateX(0)';
            slidePanel.style.opacity = '1';
        }, 150);
    }

    // Accessibility features
    announceSlideChange() {
        const slideContent = getSlideContent(this.currentSlide);
        
        // Create accessible announcement
        let announcement = document.getElementById('slide-announcement');
        if (!announcement) {
            announcement = document.createElement('div');
            announcement.id = 'slide-announcement';
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.style.position = 'absolute';
            announcement.style.left = '-10000px';
            announcement.style.width = '1px';
            announcement.style.height = '1px';
            announcement.style.overflow = 'hidden';
            document.body.appendChild(announcement);
        }
        
        announcement.textContent = `Slide ${this.currentSlide} of ${this.totalSlides}: ${slideContent.title}`;
    }

    // Public API methods
    getCurrentSlide() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.totalSlides;
    }

    isInGuidedMode() {
        return this.isGuidedMode;
    }

    isAutoPlaying() {
        return this.isPlaying;
    }
}

// Export for use in other modules
window.SlideSystem = SlideSystem;
