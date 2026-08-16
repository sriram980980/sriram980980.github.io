// Flows View Component
// Handles the transaction flow scenarios and visualizations

class FlowsView {
    constructor() {
        this.currentScenario = null;
        this.animationSpeed = 1000; // milliseconds between steps
        this.isPlaying = false;
        this.currentStep = 0;
        this.scenarios = this.initializeScenarios();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScenarioCards();
    }

    initializeScenarios() {
        return {
            'company-listing': {
                title: 'Company Gets Listed',
                description: 'Journey from private company to public trading',
                icon: '🏢',
                steps: [
                    {
                        id: 'private-company',
                        title: 'Private Company',
                        description: 'Company operates privately with limited shareholders',
                        icon: '🏠',
                        position: { x: 50, y: 100 },
                        participants: ['Company Management', 'Private Investors', 'Board of Directors'],
                        impacts: ['Limited liquidity', 'Restricted capital access', 'Private valuation']
                    },
                    {
                        id: 'ipo-decision',
                        title: 'IPO Decision',
                        description: 'Board decides to go public for capital and growth',
                        icon: '💡',
                        position: { x: 250, y: 100 },
                        participants: ['Board of Directors', 'Investment Banks', 'Legal Advisors'],
                        impacts: ['Increased regulatory requirements', 'Public disclosure obligations', 'Enhanced credibility']
                    },
                    {
                        id: 'registration',
                        title: 'SEC Registration',
                        description: 'File S-1 registration statement with regulators',
                        icon: '📋',
                        position: { x: 450, y: 100 },
                        participants: ['SEC', 'Underwriters', 'Legal Teams', 'Auditors'],
                        impacts: ['Regulatory compliance', 'Financial transparency', 'Due diligence costs']
                    },
                    {
                        id: 'roadshow',
                        title: 'Investor Roadshow',
                        description: 'Marketing the IPO to institutional investors',
                        icon: '🎯',
                        position: { x: 150, y: 250 },
                        participants: ['Company Management', 'Investment Banks', 'Institutional Investors'],
                        impacts: ['Price discovery', 'Demand assessment', 'Marketing costs']
                    },
                    {
                        id: 'pricing',
                        title: 'IPO Pricing',
                        description: 'Final pricing and allocation of shares',
                        icon: '💰',
                        position: { x: 350, y: 250 },
                        participants: ['Underwriters', 'Company', 'Lead Investors'],
                        impacts: ['Capital raised', 'Share allocation', 'Underwriting fees']
                    },
                    {
                        id: 'listing',
                        title: 'Exchange Listing',
                        description: 'Shares begin trading on public exchange',
                        icon: '📈',
                        position: { x: 550, y: 250 },
                        participants: ['Stock Exchange', 'Market Makers', 'Public Investors'],
                        impacts: ['Public liquidity', 'Price volatility', 'Market capitalization']
                    }
                ],
                flows: [
                    { from: 'private-company', to: 'ipo-decision', label: 'Growth Capital Need' },
                    { from: 'ipo-decision', to: 'registration', label: 'Regulatory Filing' },
                    { from: 'registration', to: 'roadshow', label: 'Marketing Phase' },
                    { from: 'roadshow', to: 'pricing', label: 'Demand Assessment' },
                    { from: 'pricing', to: 'listing', label: 'Public Trading' }
                ]
            },

            'equity-purchase': {
                title: 'Individual Buys Equity',
                description: 'Direct stock purchase by retail investor',
                icon: '👤',
                steps: [
                    {
                        id: 'investor-decision',
                        title: 'Investment Decision',
                        description: 'Individual decides to purchase specific stock',
                        icon: '🤔',
                        position: { x: 100, y: 100 },
                        participants: ['Retail Investor'],
                        impacts: ['Research time', 'Opportunity assessment', 'Risk evaluation']
                    },
                    {
                        id: 'broker-order',
                        title: 'Order Placement',
                        description: 'Place buy order through brokerage platform',
                        icon: '📱',
                        position: { x: 300, y: 100 },
                        participants: ['Retail Investor', 'Online Broker', 'Trading Platform'],
                        impacts: ['Order fees', 'Execution timing', 'Order type selection']
                    },
                    {
                        id: 'market-routing',
                        title: 'Order Routing',
                        description: 'Broker routes order to best execution venue',
                        icon: '🔄',
                        position: { x: 500, y: 100 },
                        participants: ['Broker', 'Market Centers', 'Routing Algorithms'],
                        impacts: ['Price improvement', 'Execution speed', 'Market impact']
                    },
                    {
                        id: 'execution',
                        title: 'Trade Execution',
                        description: 'Order matched and executed on exchange',
                        icon: '⚡',
                        position: { x: 200, y: 250 },
                        participants: ['Exchange', 'Market Makers', 'Other Investors'],
                        impacts: ['Final execution price', 'Fill quantity', 'Slippage']
                    },
                    {
                        id: 'settlement',
                        title: 'Trade Settlement',
                        description: 'Cash and securities transfer (T+2)',
                        icon: '🏦',
                        position: { x: 400, y: 250 },
                        participants: ['Clearinghouse', 'Custodian', 'Settlement Banks'],
                        impacts: ['Settlement risk', 'Cash requirements', 'Share ownership']
                    },
                    {
                        id: 'custody',
                        title: 'Share Custody',
                        description: 'Shares held in brokerage account',
                        icon: '🔒',
                        position: { x: 300, y: 350 },
                        participants: ['Broker-Dealer', 'Custodian Bank', 'Investor'],
                        impacts: ['Portfolio value', 'Dividend rights', 'Voting rights']
                    }
                ],
                flows: [
                    { from: 'investor-decision', to: 'broker-order', label: 'Order Submission' },
                    { from: 'broker-order', to: 'market-routing', label: 'Best Execution' },
                    { from: 'market-routing', to: 'execution', label: 'Market Order' },
                    { from: 'execution', to: 'settlement', label: 'Trade Confirmation' },
                    { from: 'settlement', to: 'custody', label: 'Share Delivery' }
                ]
            },

            'fund-launch': {
                title: 'Fund House Launches Fund',
                description: 'Creating and registering investment fund',
                icon: '🏦',
                steps: [
                    {
                        id: 'fund-concept',
                        title: 'Fund Strategy',
                        description: 'Develop investment strategy and fund concept',
                        icon: '💭',
                        position: { x: 100, y: 100 },
                        participants: ['Fund Manager', 'Investment Committee', 'Strategy Team'],
                        impacts: ['Investment thesis', 'Target returns', 'Risk parameters']
                    },
                    {
                        id: 'legal-structure',
                        title: 'Legal Structure',
                        description: 'Establish fund legal entity and documentation',
                        icon: '⚖️',
                        position: { x: 350, y: 100 },
                        participants: ['Legal Counsel', 'Fund Administrator', 'Regulatory Team'],
                        impacts: ['Legal costs', 'Compliance framework', 'Tax efficiency']
                    },
                    {
                        id: 'regulatory-filing',
                        title: 'Regulatory Filing',
                        description: 'File registration with SEC and state regulators',
                        icon: '📄',
                        position: { x: 600, y: 100 },
                        participants: ['SEC', 'State Regulators', 'Compliance Officer'],
                        impacts: ['Registration fees', 'Disclosure requirements', 'Time to market']
                    },
                    {
                        id: 'service-providers',
                        title: 'Service Providers',
                        description: 'Engage custodian, transfer agent, and auditor',
                        icon: '🤝',
                        position: { x: 150, y: 250 },
                        participants: ['Custodian Bank', 'Transfer Agent', 'Auditor', 'Administrator'],
                        impacts: ['Operating costs', 'Service quality', 'Operational risk']
                    },
                    {
                        id: 'fund-launch',
                        title: 'Fund Launch',
                        description: 'Begin accepting investor subscriptions',
                        icon: '🚀',
                        position: { x: 400, y: 250 },
                        participants: ['Distribution Team', 'Marketing', 'Sales Force'],
                        impacts: ['Initial assets', 'Distribution costs', 'Market reception']
                    },
                    {
                        id: 'operations',
                        title: 'Operations',
                        description: 'Daily fund operations and NAV calculation',
                        icon: '⚙️',
                        position: { x: 650, y: 250 },
                        participants: ['Fund Accountant', 'Portfolio Manager', 'Operations Team'],
                        impacts: ['Daily NAV', 'Performance tracking', 'Operational efficiency']
                    }
                ],
                flows: [
                    { from: 'fund-concept', to: 'legal-structure', label: 'Structure Decision' },
                    { from: 'legal-structure', to: 'regulatory-filing', label: 'Registration Process' },
                    { from: 'regulatory-filing', to: 'service-providers', label: 'Operational Setup' },
                    { from: 'service-providers', to: 'fund-launch', label: 'Go-to-Market' },
                    { from: 'fund-launch', to: 'operations', label: 'Daily Operations' }
                ]
            },

            'fund-investment': {
                title: 'Individual Invests in Fund',
                description: 'Purchasing fund units/shares',
                icon: '💰',
                steps: [
                    {
                        id: 'fund-research',
                        title: 'Fund Research',
                        description: 'Investor researches fund options',
                        icon: '🔍',
                        position: { x: 100, y: 100 },
                        participants: ['Individual Investor', 'Financial Advisor', 'Fund Company'],
                        impacts: ['Time investment', 'Information gathering', 'Decision criteria']
                    },
                    {
                        id: 'application',
                        title: 'Investment Application',
                        description: 'Submit application with investment amount',
                        icon: '📝',
                        position: { x: 350, y: 100 },
                        participants: ['Investor', 'Fund Company', 'Transfer Agent'],
                        impacts: ['Minimum investment', 'Application fees', 'Documentation']
                    },
                    {
                        id: 'kyc-aml',
                        title: 'KYC/AML Check',
                        description: 'Identity verification and compliance screening',
                        icon: '🔐',
                        position: { x: 600, y: 100 },
                        participants: ['Transfer Agent', 'Compliance Team', 'Third-party Vendors'],
                        impacts: ['Verification time', 'Compliance costs', 'Approval status']
                    },
                    {
                        id: 'nav-calculation',
                        title: 'NAV Calculation',
                        description: 'Determine purchase price based on NAV',
                        icon: '🧮',
                        position: { x: 200, y: 250 },
                        participants: ['Fund Accountant', 'Pricing Services', 'Custodian'],
                        impacts: ['Purchase price', 'Timing of investment', 'Market valuation']
                    },
                    {
                        id: 'unit-allocation',
                        title: 'Unit Allocation',
                        description: 'Calculate and allocate fund shares/units',
                        icon: '📊',
                        position: { x: 450, y: 250 },
                        participants: ['Transfer Agent', 'Fund Accountant', 'Registrar'],
                        impacts: ['Share quantity', 'Fractional shares', 'Account update']
                    },
                    {
                        id: 'confirmation',
                        title: 'Investment Confirmation',
                        description: 'Send confirmation to investor',
                        icon: '✅',
                        position: { x: 350, y: 350 },
                        participants: ['Transfer Agent', 'Investor', 'Communication Systems'],
                        impacts: ['Portfolio update', 'Tax reporting', 'Performance tracking']
                    }
                ],
                flows: [
                    { from: 'fund-research', to: 'application', label: 'Investment Decision' },
                    { from: 'application', to: 'kyc-aml', label: 'Compliance Check' },
                    { from: 'kyc-aml', to: 'nav-calculation', label: 'Approved Investment' },
                    { from: 'nav-calculation', to: 'unit-allocation', label: 'Share Calculation' },
                    { from: 'unit-allocation', to: 'confirmation', label: 'Confirmation Process' }
                ]
            },

            'fund-equity-purchase': {
                title: 'Fund Purchases Equity',
                description: "Fund's investment in underlying securities",
                icon: '🔄',
                steps: [
                    {
                        id: 'investment-research',
                        title: 'Investment Research',
                        description: 'Portfolio manager researches investment opportunities',
                        icon: '📈',
                        position: { x: 100, y: 100 },
                        participants: ['Portfolio Manager', 'Research Analysts', 'Risk Team'],
                        impacts: ['Research costs', 'Investment thesis', 'Risk assessment']
                    },
                    {
                        id: 'investment-committee',
                        title: 'Investment Committee',
                        description: 'Committee approves investment decision',
                        icon: '👥',
                        position: { x: 350, y: 100 },
                        participants: ['Investment Committee', 'Portfolio Manager', 'Risk Officer'],
                        impacts: ['Decision timeline', 'Risk controls', 'Position limits']
                    },
                    {
                        id: 'trade-order',
                        title: 'Trade Order',
                        description: 'Generate trade order for execution',
                        icon: '📋',
                        position: { x: 600, y: 100 },
                        participants: ['Portfolio Manager', 'Trader', 'Order Management System'],
                        impacts: ['Order size', 'Execution timing', 'Market impact']
                    },
                    {
                        id: 'best-execution',
                        title: 'Best Execution',
                        description: 'Execute trade seeking best price',
                        icon: '⚡',
                        position: { x: 200, y: 250 },
                        participants: ['Trader', 'Prime Broker', 'Multiple Venues'],
                        impacts: ['Execution price', 'Transaction costs', 'Market timing']
                    },
                    {
                        id: 'trade-settlement',
                        title: 'Trade Settlement',
                        description: 'Settle trade and update fund portfolio',
                        icon: '🏦',
                        position: { x: 450, y: 250 },
                        participants: ['Prime Broker', 'Custodian', 'Fund Administrator'],
                        impacts: ['Settlement costs', 'Portfolio composition', 'Cash impact']
                    },
                    {
                        id: 'nav-impact',
                        title: 'NAV Impact',
                        description: 'Update fund NAV with new position',
                        icon: '💹',
                        position: { x: 350, y: 350 },
                        participants: ['Fund Accountant', 'Pricing Services', 'Administrator'],
                        impacts: ['Fund performance', 'Investor returns', 'Portfolio risk']
                    }
                ],
                flows: [
                    { from: 'investment-research', to: 'investment-committee', label: 'Investment Proposal' },
                    { from: 'investment-committee', to: 'trade-order', label: 'Approved Decision' },
                    { from: 'trade-order', to: 'best-execution', label: 'Trade Execution' },
                    { from: 'best-execution', to: 'trade-settlement', label: 'Post-Trade Process' },
                    { from: 'trade-settlement', to: 'nav-impact', label: 'Portfolio Update' }
                ]
            },

            'impact-analysis': {
                title: 'Impact on Individual',
                description: 'How transactions affect end investors',
                icon: '📊',
                steps: [
                    {
                        id: 'market-performance',
                        title: 'Market Performance',
                        description: 'Underlying equity performance affects fund value',
                        icon: '📈',
                        position: { x: 100, y: 100 },
                        participants: ['Public Companies', 'Market Forces', 'Economic Factors'],
                        impacts: ['Stock price movement', 'Market volatility', 'Sector performance']
                    },
                    {
                        id: 'fund-performance',
                        title: 'Fund Performance',
                        description: 'Fund NAV reflects underlying portfolio changes',
                        icon: '💼',
                        position: { x: 350, y: 100 },
                        participants: ['Fund Manager', 'Portfolio Securities', 'Benchmark'],
                        impacts: ['Fund returns', 'Relative performance', 'Risk-adjusted returns']
                    },
                    {
                        id: 'fee-impact',
                        title: 'Fee Impact',
                        description: 'Management and other fees reduce investor returns',
                        icon: '💰',
                        position: { x: 600, y: 100 },
                        participants: ['Fund Company', 'Service Providers', 'Investor'],
                        impacts: ['Management fees', 'Operating expenses', 'Net returns']
                    },
                    {
                        id: 'tax-implications',
                        title: 'Tax Implications',
                        description: 'Capital gains and dividend distributions',
                        icon: '📋',
                        position: { x: 200, y: 250 },
                        participants: ['Fund Company', 'Tax Authorities', 'Investor'],
                        impacts: ['Taxable distributions', 'Tax efficiency', 'After-tax returns']
                    },
                    {
                        id: 'portfolio-value',
                        title: 'Portfolio Value',
                        description: 'Net impact on investor portfolio value',
                        icon: '💎',
                        position: { x: 450, y: 250 },
                        participants: ['Individual Investor', 'Portfolio', 'Market Value'],
                        impacts: ['Total return', 'Portfolio allocation', 'Financial goals']
                    },
                    {
                        id: 'financial-planning',
                        title: 'Financial Planning',
                        description: 'Impact on long-term financial objectives',
                        icon: '🎯',
                        position: { x: 350, y: 350 },
                        participants: ['Investor', 'Financial Advisor', 'Life Goals'],
                        impacts: ['Goal achievement', 'Risk tolerance', 'Investment strategy']
                    }
                ],
                flows: [
                    { from: 'market-performance', to: 'fund-performance', label: 'Performance Flow' },
                    { from: 'fund-performance', to: 'fee-impact', label: 'Fee Deduction' },
                    { from: 'fee-impact', to: 'tax-implications', label: 'Tax Events' },
                    { from: 'tax-implications', to: 'portfolio-value', label: 'Net Impact' },
                    { from: 'portfolio-value', to: 'financial-planning', label: 'Goal Assessment' }
                ]
            }
        };
    }

    setupEventListeners() {
        // Scenario card clicks
        document.querySelectorAll('.scenario-card').forEach(card => {
            card.addEventListener('click', () => {
                const scenario = card.dataset.scenario;
                this.selectScenario(scenario);
            });
        });

        // Flow controls
        document.getElementById('play-flow').addEventListener('click', () => {
            this.playFlow();
        });

        document.getElementById('step-flow').addEventListener('click', () => {
            this.stepFlow();
        });

        document.getElementById('reset-flow').addEventListener('click', () => {
            this.resetFlow();
        });
    }

    setupScenarioCards() {
        // Add interaction effects to scenario cards
        document.querySelectorAll('.scenario-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.highlightScenarioCard(card);
            });

            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('active')) {
                    this.unhighlightScenarioCard(card);
                }
            });
        });
    }

    selectScenario(scenarioId) {
        // Clear previous selection
        document.querySelectorAll('.scenario-card').forEach(card => {
            card.classList.remove('active');
        });

        // Select new scenario
        const selectedCard = document.querySelector(`[data-scenario="${scenarioId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
        }

        this.currentScenario = scenarioId;
        this.renderScenarioFlow();
    }

    renderScenarioFlow() {
        if (!this.currentScenario) return;

        const scenario = this.scenarios[this.currentScenario];
        const canvas = document.getElementById('flow-canvas');

        // Clear previous content
        canvas.innerHTML = '';

        // Create SVG for flow paths
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.zIndex = '1';
        canvas.appendChild(svg);

        // Add title
        const title = document.createElement('div');
        title.className = 'flow-title';
        title.innerHTML = `
            <h3>${scenario.title}</h3>
            <p>${scenario.description}</p>
        `;
        title.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 10;
            background: rgba(255, 255, 255, 0.9);
            padding: 15px 20px;
            border-radius: 10px;
            border: 2px solid #3498db;
        `;
        canvas.appendChild(title);

        // Render steps
        scenario.steps.forEach((step, index) => {
            const stepElement = this.createStepElement(step, index);
            canvas.appendChild(stepElement);
        });

        // Render flow paths
        this.renderFlowPaths(svg, scenario);

        this.resetFlow();
    }

    createStepElement(step, index) {
        const element = document.createElement('div');
        element.className = 'flow-step';
        element.dataset.stepId = step.id;
        element.dataset.stepIndex = index;
        
        element.style.left = step.position.x + 'px';
        element.style.top = step.position.y + 'px';

        element.innerHTML = `
            <span class="flow-step-icon">${step.icon}</span>
            <div class="flow-step-title">${step.title}</div>
            <div class="flow-step-description">${step.description}</div>
        `;

        // Add click handler for step details
        element.addEventListener('click', () => {
            this.showStepDetails(step);
        });

        return element;
    }

    renderFlowPaths(svg, scenario) {
        scenario.flows.forEach((flow, index) => {
            const fromStep = scenario.steps.find(s => s.id === flow.from);
            const toStep = scenario.steps.find(s => s.id === flow.to);

            if (fromStep && toStep) {
                const path = this.createFlowPath(fromStep.position, toStep.position, flow.label);
                svg.appendChild(path);
            }
        });
    }

    createFlowPath(fromPos, toPos, label) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Create path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M ${fromPos.x + 75} ${fromPos.y + 50} Q ${(fromPos.x + toPos.x) / 2} ${fromPos.y - 50} ${toPos.x + 75} ${toPos.y + 50}`;
        
        path.setAttribute('d', d);
        path.setAttribute('class', 'flow-path');
        path.setAttribute('stroke', '#3498db');
        path.setAttribute('stroke-width', '3');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-dasharray', '10,5');

        // Create arrow marker
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', `arrow-${Math.random().toString(36).substr(2, 9)}`);
        marker.setAttribute('viewBox', '0 0 10 10');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3');
        marker.setAttribute('markerWidth', '6');
        marker.setAttribute('markerHeight', '6');
        marker.setAttribute('orient', 'auto');

        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0,0 10,3 0,6');
        polygon.setAttribute('fill', '#3498db');

        marker.appendChild(polygon);
        defs.appendChild(marker);
        group.appendChild(defs);

        path.setAttribute('marker-end', `url(#${marker.getAttribute('id')})`);
        group.appendChild(path);

        return group;
    }

    showStepDetails(step) {
        // Create modal or side panel with step details
        const modal = document.createElement('div');
        modal.className = 'step-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${step.icon} ${step.title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p><strong>Description:</strong> ${step.description}</p>
                    
                    <div class="detail-section">
                        <h4>Participants:</h4>
                        <ul>
                            ${step.participants.map(p => `<li>${p}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Key Impacts:</h4>
                        <ul>
                            ${step.impacts.map(i => `<li>${i}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        modal.querySelector('.modal-content').style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 0;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;

        modal.querySelector('.modal-header').style.cssText = `
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 20px;
            border-radius: 15px 15px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        modal.querySelector('.modal-body').style.cssText = `
            padding: 20px;
        `;

        modal.querySelector('.modal-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 5px;
        `;

        // Close modal functionality
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-close')) {
                document.body.removeChild(modal);
            }
        });

        document.body.appendChild(modal);
    }

    playFlow() {
        if (this.isPlaying) {
            this.stopFlow();
            return;
        }

        this.isPlaying = true;
        document.getElementById('play-flow').textContent = 'Pause Flow';
        
        this.animateFlow();
    }

    stopFlow() {
        this.isPlaying = false;
        document.getElementById('play-flow').textContent = 'Play Flow';
    }

    stepFlow() {
        if (!this.currentScenario) return;

        const scenario = this.scenarios[this.currentScenario];
        const steps = document.querySelectorAll('.flow-step');
        
        if (this.currentStep < steps.length) {
            this.activateStep(this.currentStep);
            this.currentStep++;
        }

        if (this.currentStep >= steps.length) {
            this.currentStep = 0;
        }
    }

    resetFlow() {
        this.stopFlow();
        this.currentStep = 0;
        
        // Reset all steps
        document.querySelectorAll('.flow-step').forEach(step => {
            step.classList.remove('active', 'highlighted');
        });

        document.querySelectorAll('.flow-path').forEach(path => {
            path.classList.remove('active');
        });
    }

    animateFlow() {
        if (!this.isPlaying || !this.currentScenario) return;

        const scenario = this.scenarios[this.currentScenario];
        const steps = document.querySelectorAll('.flow-step');

        if (this.currentStep < steps.length) {
            this.activateStep(this.currentStep);
            this.currentStep++;

            setTimeout(() => {
                this.animateFlow();
            }, this.animationSpeed);
        } else {
            // Flow complete, reset for next cycle
            setTimeout(() => {
                this.resetFlow();
                this.currentStep = 0;
                if (this.isPlaying) {
                    this.animateFlow();
                }
            }, this.animationSpeed * 2);
        }
    }

    activateStep(stepIndex) {
        const steps = document.querySelectorAll('.flow-step');
        const step = steps[stepIndex];
        
        if (step) {
            step.classList.add('active');
            
            // Highlight briefly
            setTimeout(() => {
                step.classList.add('highlighted');
                setTimeout(() => {
                    step.classList.remove('highlighted');
                }, 500);
            }, 200);

            // Activate corresponding flow path
            const paths = document.querySelectorAll('.flow-path');
            if (paths[stepIndex]) {
                paths[stepIndex].classList.add('active');
            }
        }
    }

    highlightScenarioCard(card) {
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.background = 'rgba(255, 255, 255, 0.2)';
    }

    unhighlightScenarioCard(card) {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.background = 'rgba(255, 255, 255, 0.1)';
    }

    // Public API
    getCurrentScenario() {
        return this.currentScenario;
    }

    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
    }

    exportScenarioData() {
        return {
            currentScenario: this.currentScenario,
            scenarios: this.scenarios,
            isPlaying: this.isPlaying,
            currentStep: this.currentStep
        };
    }
}

// Export for global use
window.FlowsView = FlowsView;
