const techConcepts = [
    "Neural", "Quant", "Predict", "Analytic", "Cognitive", "ML", "AI", "Deep",
    "Stats", "Optimize", "Data", "Mining", "Cluster", "Classify", "Regress",
    "Detect", "NLP", "Vision", "Reinforce", "Bayes", "Genetic", "Quantum",
    "Blockchain", "Cloud", "Edge", "IoT", "BigData", "Convolutional", "GAN", 
    "Recurrent", "Supervised", "Unsupervised", "Reinforcement", "Federated",
    "Scalability", "Security", "Privacy", "Virtualization", "Automation", "DevOps",
    "Microservices", "Kubernetes", "Serverless", "Biometrics", "Robotic", "Cybersecurity",
    "AugmentedReality", "VirtualReality", "Cryptocurrency", "SmartContract", "Ethereum",
    "Bitcoin", "Litecoin", "DAG", "Hashgraph", "Interoperability", "APIs", "Agile",
    "Scrum", "Kanban", "Lean", "Sigma", "IoT", "IIoT", "Wearable", "3DPrinting",
    "QuantumComputing", "DNAComputing", "Graphene", "SolarPower", "WirelessCharging",
    "LiDAR", "Radar", "Sonar", "Geospatial", "Analytics", "ZeroTrust", "PenetrationTesting",
    "ThreatIntelligence", "Forensics", "Cryptography", "DataLake", "DataWarehouse", "ETL",
    "ELT", "DataFabric", "DataMesh", "Metaheuristics", "SwarmIntelligence", "SimulatedAnnealing",
    "GeneticAlgorithms", "ParticleSwarm", "AntColony", "EvolutionaryComputation", "DeepFakes",
    "EdgeComputing", "FogComputing", "QuantumEncryption", "QuantumKeyDistribution",
    "PostQuantumCryptography", "MachineVision", "SpeechRecognition", "LanguageUnderstanding",
    "SemanticWeb", "LinkedData", "KnowledgeGraphs"
];

const techSuffixes = [
    "Systems", "Solutions", "Technologies", "Networks", "Innovations", "Dynamics",
    "Applications", "Informatics", "Platforms", "Services", "Tools", "Labs", "Works",
    "Concepts", "Frameworks", "Architectures", "Machines", "Devices", "Intelligence",
    "Analytics", "Operations", "Strategies", "Programs", "Processes", "Models"
];

export function generateProjectName(): string {
    // Randomly select one element from each array
    const techConcept = techConcepts[Math.floor(Math.random() * techConcepts.length)];
    const techSuffix = techSuffixes[Math.floor(Math.random() * techSuffixes.length)];

    // Combine the elements with '-' to form the project name
    return `${techConcept}-${techSuffix}`;
}
