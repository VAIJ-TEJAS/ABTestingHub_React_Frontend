const techConcepts = [
    "Neural", "Quant", "Predict", "Analytic", "Cognitive", "ML", "AI", "Deep",
    "Stats", "Optimize", "Data", "Mining", "Cluster", "Classify", "Regress",
    "Detect", "NLP", "Vision", "Reinforce", "Bayes", "Genetic", "Quantum",
    "Blockchain", "Cloud", "Edge", "IoT", "BigData", "Hadoop", "Spark", "Tensor",
    "Convolutional", "GAN", "Recurrent", "Supervised", "Unsupervised", "Reinforcement",
    "Federated", "Scalability", "Security", "Privacy", "Virtualization", "Automation",
    "DevOps", "Microservices", "Kubernetes", "Serverless", "Biometrics", "Robotic",
    "Cybersecurity", "AugmentedReality", "VirtualReality", "Blockchain", "Cryptocurrency",
    "SmartContract", "Ethereum", "Bitcoin", "Litecoin", "DAG", "Hashgraph", "Interoperability",
    "APIs", "Agile", "Scrum", "Kanban", "Lean", "Sigma", "IoT", "IIoT", "Wearable",
    "3DPrinting", "QuantumComputing", "DNAComputing", "Graphene", "SolarPower", "WirelessCharging",
    "LiDAR", "Radar", "Sonar", "Geospatial", "Analytics", "BigQuery", "Snowflake",
    "DynamoDB", "Cassandra", "MongoDB", "Neo4j", "Elasticsearch", "Kafka", "RabbitMQ",
    "ZeroTrust", "PenetrationTesting", "ThreatIntelligence", "Forensics", "Cryptography",
    "DataLake", "DataWarehouse", "ETL", "ELT", "DataFabric", "DataMesh", "Metaheuristics",
    "SwarmIntelligence", "SimulatedAnnealing", "GeneticAlgorithms", "ParticleSwarm",
    "AntColony", "EvolutionaryComputation", "DeepFakes", "EdgeComputing", "FogComputing",
    "QuantumEncryption", "QuantumKeyDistribution", "PostQuantumCryptography", "MachineVision",
    "SpeechRecognition", "LanguageUnderstanding", "SemanticWeb", "LinkedData", "KnowledgeGraphs"
];


const famousScientists = [
    "Turing", "Pearson", "Fisher", "Bayes", "Lovelace", "Shannon", "Wiener",
    "LeCun", "Hinton", "Goodfellow", "Bengio", "Dijkstra", "Knuth", "Codd", 
    "Boole", "VonNeumann", "Einstein", "Feynman", "Curie", "Hawking", "Tesla",
    "Edison", "Faraday", "Heisenberg", "Dirac", "Ramanujan", "Poincare", "Lagrange",
    "Fourier", "Gauss", "Euler", "Cantor", "Mandelbrot", "Schrödinger", "Fermi",
    "Pascal", "Newton", "Galileo", "Kepler", "Crick", "Watson", "Franklin", "Pasteur",
    "Darwin", "Mendel", "Planck", "Bohr", "Oppenheimer", "Fibonacci", "Laplace",
    "Wolfram", "Minsky", "McCulloch", "Pitts", "Tarski", "Russell", "Gödel", 
    "Perelman", "Nash", "Wiles", "Mirzakhani", "Liskov", "Torvalds", "Stallman",
    "Ritchie", "Stroustrup", "Engelbart", "Berners-Lee", "Kernighan", "Pike"
];


const placesInstitutions = [
    "SiliconValley", "MIT", "Stanford", "Cambridge", "Harvard", "CERN",
    "BellLabs", "IBM", "Google", "DeepMind", "OpenAI", "Caltech", "Berkeley",
    "Oxford", "Princeton", "Yale", "Columbia", "UCLA", "ETHZ", "ImperialCollege",
    "Tsinghua", "NUS", "KAIST", "Weizmann", "MaxPlanck", "NASA", "JPL", "CarnegieMellon",
    "Waterloo", "EPFL", "TokyoTech", "UCL", "GeorgiaTech", "INRIA", "Skoltech",
    "TUM", "KTH", "UniversityOfToronto", "McGill", "UniversityOfMelbourne", "UNSW",
    "IITDelhi", "IITBombay", "IITMadras", "NCBS", "TIFR", "SRI", "PARC", "MicrosoftResearch",
    "FacebookAI", "AmazonLab126", "BaiduResearch", "Huawei", "NVIDIA", "IntelLabs",
    "Samsung", "LG", "Sony", "Panasonic"
];

export function generateProjectName(): string {
    // Randomly select one element from each array
    const techConcept = techConcepts[Math.floor(Math.random() * techConcepts.length)];
    const famousScientist = famousScientists[Math.floor(Math.random() * famousScientists.length)];
    const placeInstitution = placesInstitutions[Math.floor(Math.random() * placesInstitutions.length)];

    // Generate a random 5-digit number
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;

    // Combine the elements with '-' to form the project name
    return `${techConcept}-${famousScientist}-${placeInstitution}-${randomNumber}`;
}