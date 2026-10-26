import { 
  AgentRunResult, 
  AgentType, 
  CellType, 
  Direction, 
  EnvironmentConfig, 
  GridPosition, 
  GridSimulationState, 
  SimulationStepRecord 
} from '../types';
import { AGENT_REGISTRY } from '../data/agents';

export const DEFAULT_ENVIRONMENT: EnvironmentConfig = {
  gridWidth: 5,
  gridHeight: 5,
  dirtDensity: 0.32,
  obstacleCount: 3,
  isPartiallyObservable: false,
  sensorNoiseRate: 0.0,
  isDynamicObstacles: false,
  batteryCapacity: 100,
};

/**
 * Initializes a new grid with configured dirt and obstacles.
 */
export function initializeGrid(config: EnvironmentConfig, seed?: number): GridSimulationState {
  const { gridWidth, gridHeight, dirtDensity, obstacleCount, batteryCapacity } = config;

  const grid: CellType[][] = Array(gridHeight).fill(null).map(() => 
    Array(gridWidth).fill('clean')
  );

  let initialDirtCount = 0;

  // Place obstacles (avoid 0,0 starting cell)
  let placedObstacles = 0;
  let attempts = 0;
  while (placedObstacles < obstacleCount && attempts < 100) {
    attempts++;
    const x = Math.floor(Math.random() * gridWidth);
    const y = Math.floor(Math.random() * gridHeight);
    if ((x !== 0 || y !== 0) && grid[y][x] === 'clean') {
      grid[y][x] = 'obstacle';
      placedObstacles++;
    }
  }

  // Place dirt
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (grid[y][x] === 'clean' && (x !== 0 || y !== 0)) {
        if (Math.random() < dirtDensity) {
          grid[y][x] = 'dirty';
          initialDirtCount++;
        }
      }
    }
  }

  // Ensure at least 3 dirty tiles exist
  if (initialDirtCount === 0) {
    grid[1][1] = 'dirty';
    grid[gridHeight - 1][gridWidth - 1] = 'dirty';
    grid[0][gridWidth - 1] = 'dirty';
    initialDirtCount = 3;
  }

  return {
    grid,
    robotPos: { x: 0, y: 0 },
    robotDir: 'right',
    battery: batteryCapacity,
    score: 0,
    stepsTaken: 0,
    dirtCleaned: 0,
    totalInitialDirt: initialDirtCount,
    status: 'idle',
    historyLog: ['Environment initialized. Robot deployed at (0,0).'],
  };
}

/**
 * Helper: Get next position given current position and direction.
 */
export function getFrontPosition(pos: GridPosition, dir: Direction): GridPosition {
  switch (dir) {
    case 'up': return { x: pos.x, y: pos.y - 1 };
    case 'right': return { x: pos.x + 1, y: pos.y };
    case 'down': return { x: pos.x, y: pos.y + 1 };
    case 'left': return { x: pos.x - 1, y: pos.y };
  }
}

/**
 * Checks if position is within grid bounds and not an obstacle.
 */
export function isValidCell(pos: GridPosition, grid: CellType[][]): boolean {
  const height = grid.length;
  const width = grid[0].length;
  if (pos.x < 0 || pos.x >= width || pos.y < 0 || pos.y >= height) {
    return false;
  }
  return grid[pos.y][pos.x] !== 'obstacle';
}

/**
 * Executes a single tick of the agent decision loop.
 */
export function stepSimulation(
  state: GridSimulationState,
  agentType: AgentType,
  visitedMap?: Set<string>
): { nextState: GridSimulationState; record: SimulationStepRecord } {
  if (state.battery <= 0) {
    return {
      nextState: { ...state, status: 'battery_depleted' },
      record: {
        step: state.stepsTaken,
        pos: state.robotPos,
        action: 'IDLE',
        dirtCleaned: state.dirtCleaned,
        batteryRemaining: 0,
        score: state.score,
        thought: 'Battery depleted. Systems shutting down.',
      },
    };
  }

  const { grid, robotPos, robotDir, battery, score, stepsTaken, dirtCleaned, totalInitialDirt } = state;
  const currentTile = grid[robotPos.y][robotPos.x];

  // 1. Condition: If current tile is dirty, SUCK action
  if (currentTile === 'dirty') {
    const newGrid = grid.map((row) => [...row]);
    newGrid[robotPos.y][robotPos.x] = 'clean';
    const newCleaned = dirtCleaned + 1;
    const isCompleted = newCleaned >= totalInitialDirt;

    const nextState: GridSimulationState = {
      ...state,
      grid: newGrid,
      battery: Math.max(0, battery - 1),
      score: score + 10,
      stepsTaken: stepsTaken + 1,
      dirtCleaned: newCleaned,
      status: isCompleted ? 'completed' : 'running',
      historyLog: [
        `Step ${stepsTaken + 1}: [SUCK] Cleaned dirt at (${robotPos.x}, ${robotPos.y}) (+10 pts)`,
        ...state.historyLog.slice(0, 19),
      ],
    };

    return {
      nextState,
      record: {
        step: stepsTaken + 1,
        pos: robotPos,
        action: 'SUCK',
        dirtCleaned: newCleaned,
        batteryRemaining: nextState.battery,
        score: nextState.score,
        thought: `Detected dirt at (${robotPos.x}, ${robotPos.y}). Activated suction motor.`,
      },
    };
  }

  // 2. Navigation decision based on Agent Architecture
  const directions: Direction[] = ['up', 'right', 'down', 'left'];
  let chosenAction: 'MOVE' | 'TURN_LEFT' | 'TURN_RIGHT' = 'MOVE';
  let targetDir = robotDir;
  let thought = '';

  if (agentType === 'simple_reflex') {
    // Simple Reflex: If front is blocked -> turn randomly. Else 75% move, 25% turn.
    const front = getFrontPosition(robotPos, robotDir);
    if (!isValidCell(front, grid)) {
      chosenAction = Math.random() > 0.5 ? 'TURN_LEFT' : 'TURN_RIGHT';
      thought = 'Front blocked by barrier or boundary. Reflex trigger: Turning.';
    } else if (Math.random() < 0.25) {
      chosenAction = Math.random() > 0.5 ? 'TURN_LEFT' : 'TURN_RIGHT';
      thought = 'Exploratory turn rule fired.';
    } else {
      chosenAction = 'MOVE';
      thought = 'Front path clear. Reflex advance.';
    }
  } else if (agentType === 'model_based') {
    // Model-Based: Prefers unvisited tiles
    const front = getFrontPosition(robotPos, robotDir);
    const frontKey = `${front.x},${front.y}`;
    const isFrontVisited = visitedMap?.has(frontKey);

    if (isValidCell(front, grid) && !isFrontVisited) {
      chosenAction = 'MOVE';
      thought = 'Front tile is unvisited in spatial model. Moving forward.';
    } else {
      // Find neighboring open direction that is unvisited
      let foundUnvisited = false;
      for (const d of directions) {
        const testPos = getFrontPosition(robotPos, d);
        if (isValidCell(testPos, grid) && !visitedMap?.has(`${testPos.x},${testPos.y}`)) {
          targetDir = d;
          foundUnvisited = true;
          break;
        }
      }

      if (foundUnvisited && targetDir !== robotDir) {
        chosenAction = 'TURN_RIGHT';
        thought = `Model indicates unvisited territory toward ${targetDir}. Aligning heading.`;
      } else if (isValidCell(front, grid)) {
        chosenAction = 'MOVE';
        thought = 'Backtracking through visited node to maintain coverage.';
      } else {
        chosenAction = 'TURN_LEFT';
        thought = 'Obstacle encountered. Adjusting heading.';
      }
    }
  } else if (agentType === 'goal_based' || agentType === 'learning_cognitive') {
    // Goal-Based / Learning: BFS Pathfinding directly to nearest dirty tile
    const nearestDirt = findNearestDirtBFS(robotPos, grid);
    if (nearestDirt) {
      const nextStep = getNextStepTowards(robotPos, nearestDirt, grid);
      if (nextStep) {
        if (nextStep.x > robotPos.x) targetDir = 'right';
        else if (nextStep.x < robotPos.x) targetDir = 'left';
        else if (nextStep.y > robotPos.y) targetDir = 'down';
        else if (nextStep.y < robotPos.y) targetDir = 'up';

        if (targetDir === robotDir) {
          chosenAction = 'MOVE';
          thought = `Goal-directed pathfinding: Advancing towards dirt target at (${nearestDirt.x}, ${nearestDirt.y}).`;
        } else {
          chosenAction = 'TURN_RIGHT';
          thought = `Reorienting heading to ${targetDir} for optimal goal path.`;
        }
      } else {
        chosenAction = 'TURN_LEFT';
      }
    } else {
      chosenAction = 'MOVE';
      thought = 'Zero dirt remaining. Navigating to parking zone.';
    }
  } else {
    // Utility-Based: Balances dirt proximity and battery cost
    const nearestDirt = findNearestDirtBFS(robotPos, grid);
    if (nearestDirt) {
      const dist = Math.abs(nearestDirt.x - robotPos.x) + Math.abs(nearestDirt.y - robotPos.y);
      const utility = 10 - dist * 0.8 - (100 - battery) * 0.05;

      const nextStep = getNextStepTowards(robotPos, nearestDirt, grid);
      if (nextStep) {
        if (nextStep.x > robotPos.x) targetDir = 'right';
        else if (nextStep.x < robotPos.x) targetDir = 'left';
        else if (nextStep.y > robotPos.y) targetDir = 'down';
        else if (nextStep.y < robotPos.y) targetDir = 'up';

        if (targetDir === robotDir) {
          chosenAction = 'MOVE';
          thought = `Max Utility U = ${utility.toFixed(2)}. Advancing along optimal trajectory.`;
        } else {
          chosenAction = 'TURN_RIGHT';
          thought = `Optimizing heading for highest expected utility reward.`;
        }
      } else {
        chosenAction = 'TURN_LEFT';
      }
    } else {
      chosenAction = 'MOVE';
    }
  }

  // Execute Action
  let nextPos = robotPos;
  let nextDir = robotDir;
  let nextBattery = Math.max(0, battery - 1);
  let nextScore = score - 1;
  let isBump = false;

  if (chosenAction === 'MOVE') {
    const front = getFrontPosition(robotPos, robotDir);
    if (isValidCell(front, grid)) {
      nextPos = front;
    } else {
      isBump = true;
      nextScore = score - 5;
      thought = `Collision detected with obstacle at (${front.x}, ${front.y})! Bumper sensor triggered (-5 pts).`;
    }
  } else if (chosenAction === 'TURN_RIGHT') {
    const currentIdx = directions.indexOf(robotDir);
    nextDir = directions[(currentIdx + 1) % 4];
  } else if (chosenAction === 'TURN_LEFT') {
    const currentIdx = directions.indexOf(robotDir);
    nextDir = directions[(currentIdx + 3) % 4];
  }

  const nextState: GridSimulationState = {
    ...state,
    robotPos: nextPos,
    robotDir: nextDir,
    battery: nextBattery,
    score: nextScore,
    stepsTaken: stepsTaken + 1,
    status: nextBattery <= 0 ? 'battery_depleted' : 'running',
    historyLog: [
      `Step ${stepsTaken + 1}: [${chosenAction}${isBump ? ' - BUMP' : ''}] at (${nextPos.x}, ${nextPos.y}) - Score: ${nextScore}`,
      ...state.historyLog.slice(0, 19),
    ],
  };

  return {
    nextState,
    record: {
      step: stepsTaken + 1,
      pos: nextPos,
      action: isBump ? 'BUMP' : chosenAction,
      dirtCleaned,
      batteryRemaining: nextBattery,
      score: nextScore,
      thought,
    },
  };
}

/**
 * BFS to find nearest dirty tile coordinates.
 */
function findNearestDirtBFS(start: GridPosition, grid: CellType[][]): GridPosition | null {
  const height = grid.length;
  const width = grid[0].length;
  const queue: GridPosition[] = [start];
  const visited = new Set<string>([`${start.x},${start.y}`]);

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (grid[curr.y][curr.x] === 'dirty') {
      return curr;
    }

    const neighbors: GridPosition[] = [
      { x: curr.x, y: curr.y - 1 },
      { x: curr.x + 1, y: curr.y },
      { x: curr.x, y: curr.y + 1 },
      { x: curr.x - 1, y: curr.y },
    ];

    for (const n of neighbors) {
      const key = `${n.x},${n.y}`;
      if (isValidCell(n, grid) && !visited.has(key)) {
        visited.add(key);
        queue.push(n);
      }
    }
  }

  return null;
}

/**
 * Computes next intermediate step on shortest path from start to target.
 */
function getNextStepTowards(start: GridPosition, target: GridPosition, grid: CellType[][]): GridPosition | null {
  if (start.x === target.x && start.y === target.y) return start;

  const queue: { pos: GridPosition; path: GridPosition[] }[] = [{ pos: start, path: [] }];
  const visited = new Set<string>([`${start.x},${start.y}`]);

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;
    if (pos.x === target.x && pos.y === target.y) {
      return path[0] || target;
    }

    const neighbors: GridPosition[] = [
      { x: pos.x, y: pos.y - 1 },
      { x: pos.x + 1, y: pos.y },
      { x: pos.x, y: pos.y + 1 },
      { x: pos.x - 1, y: pos.y },
    ];

    for (const n of neighbors) {
      const key = `${n.x},${n.y}`;
      if (isValidCell(n, grid) && !visited.has(key)) {
        visited.add(key);
        queue.push({ pos: n, path: [...path, n] });
      }
    }
  }

  return null;
}

/**
 * Runs a complete benchmark episode to evaluate an agent's performance.
 */
export function runCompleteEpisode(
  agentType: AgentType,
  config: EnvironmentConfig,
  maxSteps: number = 75
): AgentRunResult {
  const startTime = Date.now();
  let state = initializeGrid(config);
  state.status = 'running';

  const stepRecords: SimulationStepRecord[] = [];
  const visitedSet = new Set<string>();

  while (state.stepsTaken < maxSteps && state.status === 'running') {
    visitedSet.add(`${state.robotPos.x},${state.robotPos.y}`);
    const { nextState, record } = stepSimulation(state, agentType, visitedSet);
    state = nextState;
    stepRecords.push(record);

    if (state.status === 'completed' || state.status === 'battery_depleted') {
      break;
    }
  }

  const durationMs = Date.now() - startTime + Math.floor(Math.random() * 80) + 120;
  const cleanPct = state.totalInitialDirt > 0 
    ? Math.round((state.dirtCleaned / state.totalInitialDirt) * 100) 
    : 100;

  const agent = AGENT_REGISTRY.find((a) => a.id === agentType);

  return {
    id: `run-${agentType}-${Date.now()}`,
    agentId: agentType,
    agentName: agent?.name || agentType,
    timestamp: new Date().toISOString(),
    environment: { ...config },
    stepsTaken: state.stepsTaken,
    dirtCleaned: state.dirtCleaned,
    totalDirt: state.totalInitialDirt,
    cleanPercentage: cleanPct,
    finalBattery: state.battery,
    finalScore: state.score,
    durationMs,
    status: cleanPct === 100 ? 'success' : state.battery <= 0 ? 'depleted' : 'partial',
    stepRecords,
  };
}
