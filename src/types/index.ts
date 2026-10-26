export type ActivePage = 
  | 'landing'
  | 'dashboard'
  | 'simulation'
  | 'agents'
  | 'environment'
  | 'comparison'
  | 'peas'
  | 'experiments'
  | 'analytics'
  | 'reports'
  | 'architectures'
  | 'benchmarks'
  | 'history';

export type AgentType = 
  | 'simple_reflex'
  | 'model_based'
  | 'goal_based'
  | 'utility_based'
  | 'learning_cognitive';

export interface PEASDefinition {
  performance: string[];
  environment: string[];
  actuators: string[];
  sensors: string[];
}

export interface AgentInfo {
  id: AgentType;
  name: string;
  category: string;
  badge: string;
  iconName: string;
  oneLineDesc: string;
  internalState: string;
  decisionRule: string;
  strengths: string[];
  limitations: string[];
  peas: PEASDefinition;
  avgEfficiencyScore: number;
  avgStepsToClean: number;
  color: string;
}

export type CellType = 'clean' | 'dirty' | 'obstacle';

export type Direction = 'up' | 'right' | 'down' | 'left';

export interface GridPosition {
  x: number;
  y: number;
}

export interface EnvironmentConfig {
  gridWidth: number;
  gridHeight: number;
  dirtDensity: number;
  obstacleCount: number;
  isPartiallyObservable: boolean;
  sensorNoiseRate: number;
  isDynamicObstacles: boolean;
  batteryCapacity: number;
}

export interface GridSimulationState {
  grid: CellType[][];
  robotPos: GridPosition;
  robotDir: Direction;
  battery: number;
  score: number;
  stepsTaken: number;
  dirtCleaned: number;
  totalInitialDirt: number;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'battery_depleted';
  historyLog: string[];
}

export interface SimulationStepRecord {
  step: number;
  pos: GridPosition;
  action: 'MOVE' | 'SUCK' | 'TURN_LEFT' | 'TURN_RIGHT' | 'BUMP' | 'IDLE';
  dirtCleaned: number;
  batteryRemaining: number;
  score: number;
  thought?: string;
}

export interface AgentRunResult {
  id: string;
  agentId: AgentType;
  agentName: string;
  timestamp: string;
  environment: EnvironmentConfig;
  stepsTaken: number;
  dirtCleaned: number;
  totalDirt: number;
  cleanPercentage: number;
  finalBattery: number;
  finalScore: number;
  durationMs: number;
  status: 'success' | 'partial' | 'depleted';
  stepRecords: SimulationStepRecord[];
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

/* ==========================================================================
   MULTI-AGENT COGNITIVE ARCHITECTURE TYPES
   ========================================================================== */
export type ArchitectureId = 
  | 'single_react' 
  | 'sequential_pipeline' 
  | 'hierarchical_router' 
  | 'reflection_critic';

export interface AgentNode {
  id: string;
  name: string;
  role: string;
  model: string;
  description: string;
  status?: 'idle' | 'thinking' | 'acting' | 'observing' | 'done' | 'error';
  currentOutput?: string;
  tools: string[];
}

export interface NodeConnection {
  from: string;
  to: string;
  label?: string;
}

export interface ArchitectureConfig {
  temperature: number;
  maxTurns: number;
  selectedModel: string;
  enabledTools: string[];
}

export interface Architecture {
  id: ArchitectureId;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  nodes: AgentNode[];
  connections: NodeConnection[];
  strengths: string[];
  tradeoffs: string[];
  bestUseCases: string[];
  latencyProfile: 'Low' | 'Medium' | 'High';
  costProfile: 'Low' | 'Medium' | 'High';
  coordinationOverhead: 'Minimal' | 'Moderate' | 'Substantial';
  defaultConfig: ArchitectureConfig;
}

export interface BenchmarkTask {
  id: string;
  title: string;
  category: 'Code Generation' | 'System Design' | 'Financial & Analytics' | 'Security & Auth';
  difficulty: 'Standard' | 'Advanced' | 'Challenging';
  prompt: string;
  description: string;
  evalMetric: string;
}

export interface SimulationStep {
  id: string;
  stepNumber: number;
  nodeId: string;
  nodeName: string;
  phase: 'thought' | 'action' | 'observation' | 'critique' | 'synthesis';
  content: string;
  toolCall?: {
    name: string;
    args: Record<string, any> | string;
    output: string;
  };
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  durationMs: number;
  timestamp: string;
}

export interface ExperimentRun {
  id: string;
  architectureId: ArchitectureId;
  architectureName: string;
  taskId: string;
  taskTitle: string;
  prompt: string;
  startedAt: string;
  completedAt: string;
  status: 'success' | 'partial' | 'failure';
  steps: SimulationStep[];
  metrics: {
    accuracyScore: number;
    totalDurationMs: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
    toolCallCount: number;
    errorRecoveryCount: number;
  };
}
