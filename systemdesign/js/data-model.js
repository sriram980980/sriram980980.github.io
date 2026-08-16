// Trading Ecosystem Data Model
// This file contains the complete schema and data for the trading ecosystem mind map

const CATEGORIES = {
    INSTRUMENTS: 'instruments',
    FUNDS: 'funds',
    POSITIONS: 'positions',
    INFRASTRUCTURE: 'infrastructure',
    LIFECYCLE: 'lifecycle',
    PERFORMANCE: 'performance',
    RISK: 'risk',
    FLOWS: 'flows',
    REGULATORY: 'regulatory',
    PARTICIPANTS: 'participants'
};

const CATEGORY_COLORS = {
    [CATEGORIES.INSTRUMENTS]: '#3498db',
    [CATEGORIES.FUNDS]: '#27ae60',
    [CATEGORIES.POSITIONS]: '#f1c40f',
    [CATEGORIES.INFRASTRUCTURE]: '#e67e22',
    [CATEGORIES.LIFECYCLE]: '#9b59b6',
    [CATEGORIES.PERFORMANCE]: '#1abc9c',
    [CATEGORIES.RISK]: '#e74c3c',
    [CATEGORIES.FLOWS]: '#f39c12',
    [CATEGORIES.REGULATORY]: '#34495e',
    [CATEGORIES.PARTICIPANTS]: '#95a5a6'
};

// Complete Trading Ecosystem Data Model
const TRADING_ECOSYSTEM_DATA = {
    name: "Trading Ecosystem",
    description: "Complete ecosystem covering instrument inception to fund management, investor flows, settlement, and performance measurement",
    category: "root",
    level: 0,
    children: [
        {
            name: "Instruments & Assets",
            description: "Tradable financial instruments across all asset classes",
            category: CATEGORIES.INSTRUMENTS,
            level: 1,
            attributes: ["Symbol/Ticker", "ISIN/CUSIP", "Currency", "Exchange", "Asset Class", "Maturity", "Coupon/Dividend Rate"],
            data_sources: ["Exchange Data", "Issuer Filings", "Regulatory Database", "Market Data Vendors"],
            lifecycle: ["Conception", "Registration", "Listing", "Trading", "Corporate Actions", "Maturity/Delisting"],
            children: [
                {
                    name: "Equities",
                    description: "Common and preferred stocks representing ownership in companies",
                    category: CATEGORIES.INSTRUMENTS,
                    level: 2,
                    attributes: ["Ticker Symbol", "ISIN", "Shares Outstanding", "Market Cap", "Sector", "Exchange"],
                    data_sources: ["Stock Exchange", "Company Filings", "EDGAR", "Bloomberg"],
                    lifecycle: ["IPO/Listing", "Regular Trading", "Corporate Actions", "Delisting"]
                },
                {
                    name: "Fixed Income",
                    description: "Bonds, notes, and other debt securities with fixed or variable returns",
                    category: CATEGORIES.INSTRUMENTS,
                    level: 2,
                    attributes: ["CUSIP", "Maturity Date", "Coupon Rate", "Credit Rating", "Face Value", "Issue Date"],
                    data_sources: ["Bond Market Data", "Rating Agencies", "Issuer Reports", "TRACE"],
                    lifecycle: ["Issuance", "Primary Market", "Secondary Trading", "Maturity/Call"]
                },
                {
                    name: "Derivatives",
                    description: "Financial contracts deriving value from underlying assets",
                    category: CATEGORIES.INSTRUMENTS,
                    level: 2,
                    attributes: ["Contract Specification", "Underlying Asset", "Expiration", "Strike Price", "Multiplier"],
                    data_sources: ["Exchanges", "Clearinghouses", "OTC Repositories", "Market Makers"],
                    lifecycle: ["Contract Creation", "Trading", "Settlement", "Expiration/Exercise"]
                },
                {
                    name: "ETFs & Funds",
                    description: "Exchange-traded and mutual funds tracking indices or strategies",
                    category: CATEGORIES.INSTRUMENTS,
                    level: 2,
                    attributes: ["Fund Symbol", "NAV", "Expense Ratio", "AUM", "Benchmark", "Holdings"],
                    data_sources: ["Fund Company", "Custodian", "Index Provider", "Regulatory Filings"],
                    lifecycle: ["Fund Launch", "Ongoing Management", "Rebalancing", "Liquidation"]
                },
                {
                    name: "Alternative Assets",
                    description: "Real estate, commodities, private equity, and other non-traditional investments",
                    category: CATEGORIES.INSTRUMENTS,
                    level: 2,
                    attributes: ["Asset Type", "Valuation Method", "Liquidity Terms", "Management Fees"],
                    data_sources: ["Asset Managers", "Appraisers", "Market Data", "Third-party Valuations"],
                    lifecycle: ["Asset Acquisition", "Management Period", "Performance Monitoring", "Exit/Liquidation"]
                }
            ]
        },
        {
            name: "Funds & Vehicles",
            description: "Investment vehicles that pool capital to invest in various instruments",
            category: CATEGORIES.FUNDS,
            level: 1,
            attributes: ["Fund ID", "Fund Name", "Investment Strategy", "AUM", "NAV", "Expense Ratio", "Performance"],
            data_sources: ["Fund Administrator", "Custodian", "Transfer Agent", "Regulatory Filings"],
            lifecycle: ["Fund Formation", "Capital Raising", "Investment Period", "Harvesting", "Liquidation"],
            children: [
                {
                    name: "Mutual Funds",
                    description: "Open-ended investment companies offering daily liquidity",
                    category: CATEGORIES.FUNDS,
                    level: 2,
                    attributes: ["Fund Symbol", "Daily NAV", "Expense Ratio", "Load Structure", "Share Classes"],
                    data_sources: ["Transfer Agent", "Fund Accountant", "Custodian", "SEC Filings"],
                    lifecycle: ["Registration", "Launch", "Daily Operations", "Ongoing Management", "Liquidation"]
                },
                {
                    name: "Hedge Funds",
                    description: "Alternative investment vehicles using diverse strategies for accredited investors",
                    category: CATEGORIES.FUNDS,
                    level: 2,
                    attributes: ["Strategy Type", "Management Fee", "Performance Fee", "High Water Mark", "Lock-up Period"],
                    data_sources: ["Fund Administrator", "Prime Broker", "Auditor", "Regulatory Reports"],
                    lifecycle: ["Formation", "Capital Raising", "Investment Period", "Performance Period", "Wind-down"]
                },
                {
                    name: "Private Equity",
                    description: "Investment funds focusing on private companies and buyout opportunities",
                    category: CATEGORIES.FUNDS,
                    level: 2,
                    attributes: ["Vintage Year", "Fund Size", "Investment Focus", "IRR Target", "Multiple Target"],
                    data_sources: ["General Partner", "Administrator", "Auditor", "LP Reports"],
                    lifecycle: ["Fundraising", "Investment Period", "Portfolio Management", "Harvesting", "Distribution"]
                },
                {
                    name: "Pension Funds",
                    description: "Retirement benefit plans managing assets for future pension obligations",
                    category: CATEGORIES.FUNDS,
                    level: 2,
                    attributes: ["Plan Type", "Funding Ratio", "Liability Duration", "Asset Allocation", "Actuarial Assumptions"],
                    data_sources: ["Plan Sponsor", "Custodian", "Actuary", "Investment Consultant"],
                    lifecycle: ["Plan Setup", "Contribution Period", "Investment Management", "Distribution Phase"]
                }
            ]
        },
        {
            name: "Investor Positions & Holdings",
            description: "Individual and institutional investor holdings and position management",
            category: CATEGORIES.POSITIONS,
            level: 1,
            attributes: ["Account ID", "Position Size", "Cost Basis", "Market Value", "P&L", "Asset Allocation"],
            data_sources: ["Custodian", "Broker", "Portfolio Management System", "Account Statements"],
            lifecycle: ["Account Opening", "Initial Investment", "Ongoing Trading", "Rebalancing", "Account Closure"],
            children: [
                {
                    name: "Retail Investors",
                    description: "Individual investors managing personal portfolios and retirement accounts",
                    category: CATEGORIES.POSITIONS,
                    level: 2,
                    attributes: ["Account Type", "Investment Goals", "Risk Tolerance", "Time Horizon", "Tax Status"],
                    data_sources: ["Brokerage Platforms", "Robo-advisors", "Bank Statements", "Tax Documents"],
                    lifecycle: ["Onboarding", "Investment Planning", "Portfolio Building", "Monitoring", "Withdrawal"]
                },
                {
                    name: "Institutional Investors",
                    description: "Large organizations investing substantial assets professionally",
                    category: CATEGORIES.POSITIONS,
                    level: 2,
                    attributes: ["Institution Type", "AUM", "Investment Policy", "Benchmark", "Risk Limits"],
                    data_sources: ["Investment Teams", "Risk Systems", "Custodian Banks", "Performance Systems"],
                    lifecycle: ["Strategy Development", "Asset Allocation", "Manager Selection", "Monitoring", "Rebalancing"]
                },
                {
                    name: "Portfolio Management",
                    description: "Professional management of investment portfolios and asset allocation",
                    category: CATEGORIES.POSITIONS,
                    level: 2,
                    attributes: ["Portfolio Strategy", "Benchmark", "Active Share", "Tracking Error", "Alpha Target"],
                    data_sources: ["Portfolio Management Systems", "Risk Analytics", "Performance Attribution", "Market Data"],
                    lifecycle: ["Strategy Design", "Implementation", "Monitoring", "Rebalancing", "Performance Review"]
                }
            ]
        },
        {
            name: "Market Infrastructure",
            description: "Core systems and institutions enabling trading and settlement",
            category: CATEGORIES.INFRASTRUCTURE,
            level: 1,
            attributes: ["Entity Type", "Regulatory Status", "Geographic Scope", "Asset Classes Supported", "Technology Platform"],
            data_sources: ["Regulatory Filings", "Operational Reports", "Market Data", "System Specifications"],
            lifecycle: ["Authorization", "Launch", "Operations", "Upgrades", "Decommissioning"],
            children: [
                {
                    name: "Exchanges",
                    description: "Regulated marketplaces for trading securities and derivatives",
                    category: CATEGORIES.INFRASTRUCTURE,
                    level: 2,
                    attributes: ["Exchange Code", "Listing Rules", "Trading Hours", "Market Models", "Fee Structure"],
                    data_sources: ["Exchange Operations", "Regulatory Reports", "Market Data Feeds", "Member Reports"],
                    lifecycle: ["Regulatory Approval", "Market Launch", "Operations", "Rule Changes", "Market Evolution"]
                },
                {
                    name: "Clearinghouses",
                    description: "Central counterparties managing trade settlement and risk",
                    category: CATEGORIES.INFRASTRUCTURE,
                    level: 2,
                    attributes: ["CCP License", "Margin Requirements", "Default Fund", "Risk Models", "Settlement Cycles"],
                    data_sources: ["Risk Management Systems", "Regulatory Reports", "Member Reports", "Margin Systems"],
                    lifecycle: ["Authorization", "Member Onboarding", "Operations", "Risk Monitoring", "Default Management"]
                },
                {
                    name: "Custodians",
                    description: "Financial institutions safekeeping securities and providing administrative services",
                    category: CATEGORIES.INFRASTRUCTURE,
                    level: 2,
                    attributes: ["Custody Assets", "Geographic Coverage", "Service Offerings", "Technology Capabilities"],
                    data_sources: ["Custody Systems", "Client Reports", "Regulatory Filings", "Audit Reports"],
                    lifecycle: ["Client Onboarding", "Asset Safekeeping", "Corporate Actions", "Reporting", "Account Closure"]
                },
                {
                    name: "Market Data Vendors",
                    description: "Providers of real-time and historical market information",
                    category: CATEGORIES.INFRASTRUCTURE,
                    level: 2,
                    attributes: ["Data Coverage", "Feed Types", "Latency", "Historical Depth", "API Capabilities"],
                    data_sources: ["Exchange Feeds", "Vendor Systems", "Client Usage", "Quality Metrics"],
                    lifecycle: ["Data Sourcing", "Feed Development", "Distribution", "Quality Monitoring", "Enhancement"]
                }
            ]
        },
        {
            name: "Trade Lifecycle",
            description: "Complete process from order initiation to final settlement",
            category: CATEGORIES.LIFECYCLE,
            level: 1,
            attributes: ["Trade ID", "Order Type", "Execution Venue", "Settlement Date", "Trade Status", "Counterparty"],
            data_sources: ["Order Management Systems", "Execution Venues", "Post-trade Systems", "Settlement Systems"],
            lifecycle: ["Order Generation", "Routing", "Execution", "Confirmation", "Clearing", "Settlement"],
            children: [
                {
                    name: "Order Management",
                    description: "Systems and processes for creating, routing, and managing trading orders",
                    category: CATEGORIES.LIFECYCLE,
                    level: 2,
                    attributes: ["Order ID", "Order Type", "Quantity", "Price", "Time in Force", "Routing Rules"],
                    data_sources: ["OMS Systems", "Trading Desks", "Algorithmic Engines", "Compliance Systems"],
                    lifecycle: ["Order Creation", "Pre-trade Checks", "Routing", "Execution", "Post-trade Processing"]
                },
                {
                    name: "Trade Execution",
                    description: "Actual execution of trades on exchanges or alternative trading systems",
                    category: CATEGORIES.LIFECYCLE,
                    level: 2,
                    attributes: ["Execution Venue", "Fill Price", "Fill Quantity", "Execution Time", "Market Impact"],
                    data_sources: ["Exchange Systems", "ATS Platforms", "Market Makers", "Execution Reports"],
                    lifecycle: ["Order Receipt", "Matching", "Execution", "Trade Reporting", "Confirmation"]
                },
                {
                    name: "Clearing & Settlement",
                    description: "Post-trade processing ensuring proper transfer of securities and cash",
                    category: CATEGORIES.LIFECYCLE,
                    level: 2,
                    attributes: ["Settlement Date", "Delivery Method", "DVP Status", "Fails Management", "Corporate Actions"],
                    data_sources: ["Clearinghouses", "CSDs", "Settlement Systems", "Custodian Records"],
                    lifecycle: ["Trade Capture", "Clearing", "Settlement Instruction", "Settlement", "Reconciliation"]
                }
            ]
        },
        {
            name: "Valuation & Performance",
            description: "Methods and systems for pricing assets and measuring investment performance",
            category: CATEGORIES.PERFORMANCE,
            level: 1,
            attributes: ["Valuation Method", "Pricing Source", "Performance Period", "Benchmark", "Risk Metrics"],
            data_sources: ["Pricing Vendors", "Market Data", "Financial Statements", "Performance Systems"],
            lifecycle: ["Price Discovery", "Valuation", "Performance Calculation", "Attribution", "Reporting"],
            children: [
                {
                    name: "Asset Pricing",
                    description: "Methodologies for determining fair value of financial instruments",
                    category: CATEGORIES.PERFORMANCE,
                    level: 2,
                    attributes: ["Pricing Model", "Input Data", "Validation Rules", "Override Procedures", "Price Sources"],
                    data_sources: ["Market Data Vendors", "Broker Quotes", "Model Outputs", "Committee Decisions"],
                    lifecycle: ["Data Collection", "Model Application", "Validation", "Override Process", "Price Publication"]
                },
                {
                    name: "Performance Measurement",
                    description: "Calculation and analysis of investment returns and risk metrics",
                    category: CATEGORIES.PERFORMANCE,
                    level: 2,
                    attributes: ["Return Calculation", "Risk Metrics", "Attribution Analysis", "Benchmark Comparison"],
                    data_sources: ["Portfolio Systems", "Market Data", "Cash Flow Records", "Corporate Actions"],
                    lifecycle: ["Data Aggregation", "Return Calculation", "Risk Analysis", "Attribution", "Reporting"]
                },
                {
                    name: "Benchmarking",
                    description: "Comparison standards for evaluating investment performance",
                    category: CATEGORIES.PERFORMANCE,
                    level: 2,
                    attributes: ["Index Name", "Methodology", "Rebalancing Frequency", "Constituent Weights"],
                    data_sources: ["Index Providers", "Market Data", "Corporate Actions", "Methodology Documents"],
                    lifecycle: ["Index Design", "Calculation", "Maintenance", "Rebalancing", "Methodology Updates"]
                }
            ]
        },
        {
            name: "Risk & Credit",
            description: "Risk assessment, monitoring, and management across the trading ecosystem",
            category: CATEGORIES.RISK,
            level: 1,
            attributes: ["Risk Type", "Measurement Method", "Risk Limits", "Monitoring Frequency", "Mitigation Actions"],
            data_sources: ["Risk Systems", "Market Data", "Credit Agencies", "Internal Models"],
            lifecycle: ["Risk Identification", "Measurement", "Monitoring", "Reporting", "Mitigation"],
            children: [
                {
                    name: "Market Risk",
                    description: "Risk of losses due to changes in market prices and volatility",
                    category: CATEGORIES.RISK,
                    level: 2,
                    attributes: ["VaR", "Expected Shortfall", "Stress Tests", "Sensitivity Analysis", "Greeks"],
                    data_sources: ["Risk Systems", "Market Data", "Historical Scenarios", "Monte Carlo Models"],
                    lifecycle: ["Risk Measurement", "Limit Monitoring", "Stress Testing", "Reporting", "Action Plans"]
                },
                {
                    name: "Credit Risk",
                    description: "Risk of counterparty default and credit deterioration",
                    category: CATEGORIES.RISK,
                    level: 2,
                    attributes: ["Credit Rating", "PD", "LGD", "EAD", "Credit Limits", "Collateral"],
                    data_sources: ["Rating Agencies", "Financial Statements", "Credit Models", "Market Data"],
                    lifecycle: ["Credit Assessment", "Limit Setting", "Monitoring", "Review", "Action/Recovery"]
                },
                {
                    name: "Operational Risk",
                    description: "Risk of losses from inadequate processes, systems, or human factors",
                    category: CATEGORIES.RISK,
                    level: 2,
                    attributes: ["Risk Events", "Control Assessment", "KRIs", "Loss Data", "Scenario Analysis"],
                    data_sources: ["Incident Reports", "Control Testing", "Audit Reports", "KRI Systems"],
                    lifecycle: ["Risk Assessment", "Control Design", "Monitoring", "Testing", "Improvement"]
                }
            ]
        },
        {
            name: "Cash & Collateral Flows",
            description: "Movement of cash and collateral throughout the trading ecosystem",
            category: CATEGORIES.FLOWS,
            level: 1,
            attributes: ["Flow Type", "Amount", "Currency", "Settlement Date", "Counterparty", "Purpose"],
            data_sources: ["Cash Management Systems", "Settlement Systems", "Bank Statements", "Collateral Systems"],
            lifecycle: ["Flow Initiation", "Processing", "Settlement", "Reconciliation", "Reporting"],
            children: [
                {
                    name: "Investment Flows",
                    description: "Capital flows from investors into investment vehicles",
                    category: CATEGORIES.FLOWS,
                    level: 2,
                    attributes: ["Flow Direction", "Investor Type", "Amount", "Investment Vehicle", "Settlement Method"],
                    data_sources: ["Transfer Agents", "Fund Administrators", "Distribution Platforms", "Bank Records"],
                    lifecycle: ["Investment Decision", "Order Placement", "Processing", "Settlement", "Confirmation"]
                },
                {
                    name: "Margin & Collateral",
                    description: "Collateral posted to secure trading positions and reduce counterparty risk",
                    category: CATEGORIES.FLOWS,
                    level: 2,
                    attributes: ["Collateral Type", "Haircut", "Margin Call", "Rehypothecation", "Valuation"],
                    data_sources: ["Margin Systems", "Collateral Management", "Market Data", "Legal Agreements"],
                    lifecycle: ["Requirement Calculation", "Call Generation", "Collateral Delivery", "Valuation", "Return"]
                },
                {
                    name: "Dividend & Interest",
                    description: "Income distributions from investments to investors",
                    category: CATEGORIES.FLOWS,
                    level: 2,
                    attributes: ["Payment Type", "Ex-Date", "Record Date", "Payment Date", "Tax Withholding"],
                    data_sources: ["Corporate Actions", "Paying Agents", "Tax Systems", "Custodian Records"],
                    lifecycle: ["Declaration", "Ex-Date", "Record Date", "Payment", "Tax Reporting"]
                }
            ]
        },
        {
            name: "Regulatory & Compliance",
            description: "Regulatory frameworks and compliance requirements governing trading activities",
            category: CATEGORIES.REGULATORY,
            level: 1,
            attributes: ["Regulation Name", "Jurisdiction", "Compliance Requirements", "Reporting Obligations", "Penalties"],
            data_sources: ["Regulatory Bodies", "Legal Departments", "Compliance Systems", "Industry Guidelines"],
            lifecycle: ["Rule Development", "Implementation", "Monitoring", "Enforcement", "Updates"],
            children: [
                {
                    name: "Securities Regulation",
                    description: "Laws and rules governing securities markets and participants",
                    category: CATEGORIES.REGULATORY,
                    level: 2,
                    attributes: ["Regulation Type", "Scope", "Requirements", "Enforcement Agency", "Penalties"],
                    data_sources: ["SEC", "FINRA", "CFTC", "Regulatory Releases", "Legal Opinions"],
                    lifecycle: ["Proposal", "Comment Period", "Final Rule", "Implementation", "Enforcement"]
                },
                {
                    name: "Anti-Money Laundering",
                    description: "Compliance programs to detect and prevent money laundering activities",
                    category: CATEGORIES.REGULATORY,
                    level: 2,
                    attributes: ["AML Program", "Customer Due Diligence", "Transaction Monitoring", "Suspicious Activity Reports"],
                    data_sources: ["AML Systems", "Customer Data", "Transaction Records", "Regulatory Guidance"],
                    lifecycle: ["Customer Onboarding", "Ongoing Monitoring", "Investigation", "Reporting", "Training"]
                },
                {
                    name: "Market Conduct",
                    description: "Rules ensuring fair and orderly markets and preventing market abuse",
                    category: CATEGORIES.REGULATORY,
                    level: 2,
                    attributes: ["Conduct Rules", "Market Surveillance", "Insider Trading", "Market Manipulation"],
                    data_sources: ["Trading Systems", "Surveillance Tools", "Investigation Records", "Regulatory Reports"],
                    lifecycle: ["Surveillance", "Detection", "Investigation", "Enforcement", "Remediation"]
                }
            ]
        },
        {
            name: "Ecosystem Participants",
            description: "Key players and their roles in the trading ecosystem",
            category: CATEGORIES.PARTICIPANTS,
            level: 1,
            attributes: ["Participant Type", "Role", "Regulatory Status", "Key Services", "Client Base"],
            data_sources: ["Regulatory Registers", "Company Reports", "Industry Databases", "Service Agreements"],
            lifecycle: ["Registration", "Authorization", "Operations", "Supervision", "Exit"],
            children: [
                {
                    name: "Investment Banks",
                    description: "Financial institutions providing capital markets and advisory services",
                    category: CATEGORIES.PARTICIPANTS,
                    level: 2,
                    attributes: ["Services Offered", "Market Sectors", "Geographic Presence", "Capital Strength"],
                    data_sources: ["Bank Reports", "Regulatory Filings", "Market Rankings", "Client Lists"],
                    lifecycle: ["Establishment", "Service Development", "Client Acquisition", "Growth", "Evolution"]
                },
                {
                    name: "Broker-Dealers",
                    description: "Firms executing trades and providing market access to investors",
                    category: CATEGORIES.PARTICIPANTS,
                    level: 2,
                    attributes: ["Registration Status", "Services", "Client Types", "Technology Platform"],
                    data_sources: ["FINRA Database", "SEC Filings", "Trading Records", "Client Agreements"],
                    lifecycle: ["Registration", "Platform Development", "Client Onboarding", "Operations", "Compliance"]
                },
                {
                    name: "Asset Managers",
                    description: "Professional investment management firms overseeing client portfolios",
                    category: CATEGORIES.PARTICIPANTS,
                    level: 2,
                    attributes: ["AUM", "Investment Strategies", "Client Base", "Performance Track Record"],
                    data_sources: ["ADV Filings", "Performance Reports", "Client Statements", "Fund Documents"],
                    lifecycle: ["Firm Formation", "Strategy Development", "Client Acquisition", "Portfolio Management", "Growth"]
                },
                {
                    name: "Technology Vendors",
                    description: "Companies providing technology solutions for trading and portfolio management",
                    category: CATEGORIES.PARTICIPANTS,
                    level: 2,
                    attributes: ["Technology Solutions", "Client Base", "Integration Capabilities", "Innovation Pipeline"],
                    data_sources: ["Vendor Reports", "Client References", "Product Documentation", "Market Research"],
                    lifecycle: ["Product Development", "Market Entry", "Client Acquisition", "Enhancement", "Evolution"]
                }
            ]
        }
    ]
};

// Slide Content Configuration
const SLIDE_CONTENT = [
    {
        id: 1,
        title: "Welcome to the Trading Ecosystem",
        description: "Explore the complete trading ecosystem from instrument inception to fund management, investor flows, settlement, and performance measurement.",
        highlights: ["Complete System View", "Interactive Navigation", "Detailed Components"],
        focusNodes: ["Trading Ecosystem"],
        flowPaths: []
    },
    {
        id: 2,
        title: "Instrument Inception & Listing",
        description: "How financial instruments are created, registered, and made available for trading on exchanges.",
        highlights: ["Asset Creation", "Regulatory Approval", "Exchange Listing", "Market Access"],
        focusNodes: ["Instruments & Assets", "Equities", "Fixed Income", "Derivatives"],
        flowPaths: [
            ["Regulatory & Compliance", "Instruments & Assets", "Market Infrastructure"]
        ]
    },
    {
        id: 3,
        title: "Fund Inception & Management",
        description: "How investment funds are created, structured, and managed to pool investor capital.",
        highlights: ["Fund Formation", "Investment Strategy", "Regulatory Registration", "Capital Raising"],
        focusNodes: ["Funds & Vehicles", "Mutual Funds", "Hedge Funds", "Private Equity"],
        flowPaths: [
            ["Regulatory & Compliance", "Funds & Vehicles", "Asset Managers"]
        ]
    },
    {
        id: 4,
        title: "Investor Subscription & Cash Flows",
        description: "How retail and institutional investors allocate capital and generate cash flows into the ecosystem.",
        highlights: ["Investment Decisions", "Capital Allocation", "Flow Processing", "Account Management"],
        focusNodes: ["Investor Positions & Holdings", "Retail Investors", "Institutional Investors", "Cash & Collateral Flows"],
        flowPaths: [
            ["Investor Positions & Holdings", "Cash & Collateral Flows", "Funds & Vehicles"]
        ]
    },
    {
        id: 5,
        title: "Holdings & Positions Management",
        description: "How portfolios are constructed, managed, and monitored from both investor and fund manager perspectives.",
        highlights: ["Portfolio Construction", "Asset Allocation", "Position Monitoring", "Rebalancing"],
        focusNodes: ["Investor Positions & Holdings", "Portfolio Management", "Asset Managers"],
        flowPaths: [
            ["Investor Positions & Holdings", "Portfolio Management", "Instruments & Assets"]
        ]
    },
    {
        id: 6,
        title: "Trade Lifecycle Management",
        description: "Complete journey from order generation through execution, clearing, and final settlement.",
        highlights: ["Order Management", "Trade Execution", "Clearing Process", "Settlement"],
        focusNodes: ["Trade Lifecycle", "Order Management", "Trade Execution", "Clearing & Settlement"],
        flowPaths: [
            ["Order Management", "Trade Execution", "Clearing & Settlement", "Market Infrastructure"]
        ]
    },
    {
        id: 7,
        title: "Market Infrastructure",
        description: "Core systems and institutions that enable trading, including exchanges, clearinghouses, and custodians.",
        highlights: ["Exchange Operations", "Central Clearing", "Custody Services", "Market Data"],
        focusNodes: ["Market Infrastructure", "Exchanges", "Clearinghouses", "Custodians"],
        flowPaths: [
            ["Market Infrastructure", "Trade Lifecycle", "Cash & Collateral Flows"]
        ]
    },
    {
        id: 8,
        title: "Valuation & Performance Measurement",
        description: "How assets are priced and investment performance is measured against benchmarks.",
        highlights: ["Asset Pricing", "Performance Calculation", "Benchmark Comparison", "Risk Analytics"],
        focusNodes: ["Valuation & Performance", "Asset Pricing", "Performance Measurement", "Benchmarking"],
        flowPaths: [
            ["Valuation & Performance", "Instruments & Assets", "Funds & Vehicles"]
        ]
    },
    {
        id: 9,
        title: "Risk & Credit Management",
        description: "Comprehensive risk assessment including market, credit, and operational risk across the ecosystem.",
        highlights: ["Risk Measurement", "Credit Assessment", "Operational Controls", "Risk Mitigation"],
        focusNodes: ["Risk & Credit", "Market Risk", "Credit Risk", "Operational Risk"],
        flowPaths: [
            ["Risk & Credit", "Market Infrastructure", "Regulatory & Compliance"]
        ]
    },
    {
        id: 10,
        title: "Ecosystem Participants & Regulation",
        description: "Key players including banks, brokers, asset managers, and their regulatory oversight.",
        highlights: ["Market Participants", "Regulatory Framework", "Compliance Requirements", "Supervision"],
        focusNodes: ["Ecosystem Participants", "Regulatory & Compliance", "Investment Banks", "Broker-Dealers"],
        flowPaths: [
            ["Regulatory & Compliance", "Ecosystem Participants", "Market Infrastructure"]
        ]
    },
    {
        id: 11,
        title: "Complete Interconnected System",
        description: "Final view showing all components working together in the complete trading ecosystem.",
        highlights: ["System Integration", "Information Flow", "Value Chain", "Ecosystem Relationships"],
        focusNodes: [], // Show all nodes
        flowPaths: [
            ["Investor Positions & Holdings", "Cash & Collateral Flows", "Funds & Vehicles", "Instruments & Assets"],
            ["Trade Lifecycle", "Market Infrastructure", "Clearing & Settlement"],
            ["Risk & Credit", "Valuation & Performance", "Regulatory & Compliance"]
        ]
    }
];

// Helper functions for data access
function getCategoryColor(category) {
    return CATEGORY_COLORS[category] || '#95a5a6';
}

function findNodeByName(data, name) {
    if (data.name === name) return data;
    if (data.children) {
        for (let child of data.children) {
            const found = findNodeByName(child, name);
            if (found) return found;
        }
    }
    return null;
}

function getAllNodes(data, nodes = []) {
    nodes.push(data);
    if (data.children) {
        data.children.forEach(child => getAllNodes(child, nodes));
    }
    return nodes;
}

function getSlideContent(slideNumber) {
    return SLIDE_CONTENT.find(slide => slide.id === slideNumber) || SLIDE_CONTENT[0];
}
