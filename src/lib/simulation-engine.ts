import { 
  Architecture, 
  ArchitectureConfig, 
  ExperimentRun, 
  SimulationStep 
} from '../types';

/**
 * Realistic multi-agent simulation step generator.
 * Produces structured traces showing thoughts, actions, tool executions, and multi-agent coordination.
 */
export async function executeArchitectureSimulation(
  architecture: Architecture,
  taskPrompt: string,
  taskId: string,
  taskTitle: string,
  config: ArchitectureConfig,
  onStep?: (step: SimulationStep, index: number, total: number) => void,
  abortSignal?: AbortSignal
): Promise<ExperimentRun> {
  const steps: SimulationStep[] = [];
  const startTime = Date.now();

  // Determine architecture-specific workflow steps
  const workflowDefinitions = getWorkflowSteps(architecture, taskPrompt, config);
  const totalSteps = workflowDefinitions.length;

  let cumulativeInputTokens = 0;
  let cumulativeOutputTokens = 0;
  let toolCallCount = 0;
  let errorRecoveryCount = 0;

  for (let i = 0; i < totalSteps; i++) {
    if (abortSignal?.aborted) {
      break;
    }

    const def = workflowDefinitions[i];
    const stepDuration = Math.floor(Math.random() * 400) + 350; // 350 - 750ms

    // Simulate async network/processing delay
    await new Promise((resolve) => setTimeout(resolve, stepDuration));

    const stepInputTokens = Math.floor(Math.random() * 450) + 380;
    const stepOutputTokens = Math.floor(Math.random() * 320) + 160;

    cumulativeInputTokens += stepInputTokens;
    cumulativeOutputTokens += stepOutputTokens;

    if (def.toolCall) {
      toolCallCount++;
    }

    if (def.isRecovery) {
      errorRecoveryCount++;
    }

    const simStep: SimulationStep = {
      id: `step-${Date.now()}-${i}`,
      stepNumber: i + 1,
      nodeId: def.nodeId,
      nodeName: def.nodeName,
      phase: def.phase,
      content: def.content,
      toolCall: def.toolCall,
      tokens: {
        input: stepInputTokens,
        output: stepOutputTokens,
        total: stepInputTokens + stepOutputTokens,
      },
      durationMs: stepDuration,
      timestamp: new Date().toISOString(),
    };

    steps.push(simStep);
    onStep?.(simStep, i + 1, totalSteps);
  }

  const totalDurationMs = Date.now() - startTime;
  const totalTokens = cumulativeInputTokens + cumulativeOutputTokens;

  // Calculate pricing model ($0.15 / 1M input, $0.60 / 1M output for Flash, weighted for Pro nodes)
  const inputCost = (cumulativeInputTokens / 1_000_000) * 0.18;
  const outputCost = (cumulativeOutputTokens / 1_000_000) * 0.65;
  const estimatedCostUsd = parseFloat((inputCost + outputCost).toFixed(5));

  // Determine accuracy score based on architecture strengths and task resolution
  let baseAccuracy = 84;
  if (architecture.id === 'reflection_critic') {
    baseAccuracy = 96 + (Math.random() * 3 - 1.5);
  } else if (architecture.id === 'hierarchical_router') {
    baseAccuracy = 92 + (Math.random() * 4 - 2);
  } else if (architecture.id === 'sequential_pipeline') {
    baseAccuracy = 89 + (Math.random() * 3 - 1.5);
  } else if (architecture.id === 'single_react') {
    baseAccuracy = 81 + (Math.random() * 5 - 2.5);
  }

  const accuracyScore = Math.min(100, Math.max(65, Math.round(baseAccuracy * 10) / 10));

  return {
    id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    architectureId: architecture.id,
    architectureName: architecture.name,
    taskId,
    taskTitle,
    prompt: taskPrompt,
    startedAt: new Date(startTime).toISOString(),
    completedAt: new Date().toISOString(),
    status: accuracyScore >= 75 ? 'success' : 'partial',
    steps,
    metrics: {
      accuracyScore,
      totalDurationMs,
      inputTokens: cumulativeInputTokens,
      outputTokens: cumulativeOutputTokens,
      totalTokens,
      estimatedCostUsd,
      toolCallCount,
      errorRecoveryCount,
    },
  };
}

interface StepTemplate {
  nodeId: string;
  nodeName: string;
  phase: 'thought' | 'action' | 'observation' | 'critique' | 'synthesis';
  content: string;
  toolCall?: {
    name: string;
    args: Record<string, any> | string;
    output: string;
  };
  isRecovery?: boolean;
}

function getWorkflowSteps(
  architecture: Architecture,
  prompt: string,
  config: ArchitectureConfig
): StepTemplate[] {
  const truncatedPrompt = prompt.length > 60 ? prompt.substring(0, 57) + '...' : prompt;

  switch (architecture.id) {
    case 'single_react':
      return [
        {
          nodeId: 'react-agent-1',
          nodeName: 'ReAct Core Engine',
          phase: 'thought',
          content: `Analyzing prompt: "${truncatedPrompt}". Dissecting constraints, security requirements, and interface requirements in monolithic context.`,
        },
        {
          nodeId: 'react-agent-1',
          nodeName: 'ReAct Core Engine',
          phase: 'action',
          content: 'Invoking Schema Inspector to evaluate data persistence and cryptographic key structures.',
          toolCall: {
            name: 'Schema Inspector',
            args: { scope: 'security_contracts', prompt },
            output: 'Schema validated: 2 tables, 1 vault storage interface, 4 encryption tokens identified.',
          },
        },
        {
          nodeId: 'react-agent-1',
          nodeName: 'ReAct Core Engine',
          phase: 'thought',
          content: 'Schema inspector returned storage structures. Moving immediately to generate complete state machine and UI logic in single pass.',
        },
        {
          nodeId: 'react-agent-1',
          nodeName: 'ReAct Core Engine',
          phase: 'action',
          content: 'Executing Code Sandbox to build and verify combined client and auth logic.',
          toolCall: {
            name: 'Code Sandbox',
            args: { file: 'FintechApp.tsx', target: 'bundle_and_verify' },
            output: 'Compilation successful. 0 syntax errors, 1 minor memory warning in key rotation handler.',
          },
        },
        {
          nodeId: 'react-agent-1',
          nodeName: 'ReAct Core Engine',
          phase: 'observation',
          content: 'Build bundled with minor warning. Monolithic agent synthesizes output without secondary validation cycle.',
        },
        {
          nodeId: 'react-agent-1',
          nodeName: 'ReAct Core Engine',
          phase: 'synthesis',
          content: 'Final code package assembled. Fast execution, direct path, no cross-agent consensus check.',
        },
      ];

    case 'sequential_pipeline':
      return [
        {
          nodeId: 'pipe-planner',
          nodeName: 'Requirements Architect',
          phase: 'thought',
          content: `Stage 1: Deconstructing requirements into formal TypeScript interface specifications and threat models for: "${truncatedPrompt}".`,
        },
        {
          nodeId: 'pipe-planner',
          nodeName: 'Requirements Architect',
          phase: 'action',
          content: 'Inspecting regulatory requirements and architectural invariants.',
          toolCall: {
            name: 'Schema Inspector',
            args: { standard: 'FIPS-140-3', target: 'client_encryption' },
            output: 'Specification verified: AES-GCM-256 + PBKDF2 salt with 100k iterations required.',
          },
        },
        {
          nodeId: 'pipe-planner',
          nodeName: 'Requirements Architect',
          phase: 'synthesis',
          content: 'Stage 1 Hand-off: Packaging architectural contract and passing to Implementation Engineer.',
        },
        {
          nodeId: 'pipe-engineer',
          nodeName: 'Implementation Engineer',
          phase: 'thought',
          content: 'Stage 2: Consumed specification contract. Generating modular components with isolated presentation and logic tiers.',
        },
        {
          nodeId: 'pipe-engineer',
          nodeName: 'Implementation Engineer',
          phase: 'action',
          content: 'Transpiling React components, hooks, and cryptographic storage primitives in Code Sandbox.',
          toolCall: {
            name: 'Code Sandbox',
            args: { files: ['VaultContext.tsx', 'BiometricAuthModal.tsx', 'LedgerView.tsx'] },
            output: 'Compiled 3 modules cleanly. Exported type-safe signatures for QA audit.',
          },
        },
        {
          nodeId: 'pipe-engineer',
          nodeName: 'Implementation Engineer',
          phase: 'synthesis',
          content: 'Stage 2 Hand-off: Source code bundle forwarded to Security & QA Auditor for automated compliance gating.',
        },
        {
          nodeId: 'pipe-qa',
          nodeName: 'Security & QA Auditor',
          phase: 'action',
          content: 'Stage 3: Running comprehensive security linting and test coverage assertions on candidate bundle.',
          toolCall: {
            name: 'Security Linter',
            args: { strictMode: true, checkXSS: true, checkMemoryLeaks: true },
            output: '1 potential token-reuse race condition detected in biometric session timeout handler.',
          },
        },
        {
          nodeId: 'pipe-qa',
          nodeName: 'Security & QA Auditor',
          phase: 'thought',
          content: 'Patching race condition by introducing atomic session invalidation tokens and verified state transition barrier.',
          isRecovery: true,
        },
        {
          nodeId: 'pipe-qa',
          nodeName: 'Security & QA Auditor',
          phase: 'synthesis',
          content: 'Pipeline complete: 100% test pass rate, verified architectural hand-off, zero unhandled exceptions.',
        },
      ];

    case 'hierarchical_router':
      return [
        {
          nodeId: 'router-orchestrator',
          nodeName: 'Executive Orchestrator',
          phase: 'thought',
          content: `Executive triage: Task "${truncatedPrompt}" requires multi-domain decomposition across UI/UX, Data Layer, and Cryptographic Security.`,
        },
        {
          nodeId: 'router-orchestrator',
          nodeName: 'Executive Orchestrator',
          phase: 'action',
          content: 'Parallel Subagent Dispatch: Assigning Subtask 1 to UI/UX Specialist, Subtask 2 to Data Specialist, and Subtask 3 to Security Specialist.',
          toolCall: {
            name: 'Subagent Dispatch',
            args: { workers: ['worker-ui', 'worker-backend', 'worker-security'] },
            output: '3 worker threads initialized with dedicated isolated context windows.',
          },
        },
        {
          nodeId: 'worker-ui',
          nodeName: 'UI/UX Specialist',
          phase: 'action',
          content: 'Designing responsive laboratory cards, dark mode surface hierarchy, and biometric prompt dialogs.',
          toolCall: {
            name: 'Code Sandbox',
            args: { component: 'BiometricGate.tsx' },
            output: 'Design System compliance: 100% token adherence (colors #0A0D12, #171C25, #8CB8FF).',
          },
        },
        {
          nodeId: 'worker-backend',
          nodeName: 'Backend & Data Specialist',
          phase: 'action',
          content: 'Modeling double-entry ledger database schema with immutable audit journals.',
          toolCall: {
            name: 'Database Query',
            args: { ddl: 'CREATE TABLE ledger_entries (id UUID, debit NUMERIC, credit NUMERIC, hash BYTEA)' },
            output: 'Relational ledger schema verified. Hash chaining invariants verified.',
          },
        },
        {
          nodeId: 'worker-security',
          nodeName: 'Security & Auth Specialist',
          phase: 'action',
          content: 'Authoring zero-knowledge cryptographic authentication handshake.',
          toolCall: {
            name: 'Security Linter',
            args: { auditTarget: 'WebAuthn_Biometrics' },
            output: 'WebAuthn credentials bound to hardware enclave. Zero private key transmission verified.',
          },
        },
        {
          nodeId: 'router-orchestrator',
          nodeName: 'Executive Orchestrator',
          phase: 'thought',
          content: 'Aggregating outputs from 3 specialist subagents. Validating cross-boundary interface coherence between UI and Backend.',
        },
        {
          nodeId: 'router-orchestrator',
          nodeName: 'Executive Orchestrator',
          phase: 'synthesis',
          content: 'Consolidated master artifact assembled. Parallelized domain separation produced comprehensive multi-tier architecture.',
        },
      ];

    case 'reflection_critic':
      return [
        {
          nodeId: 'refl-generator',
          nodeName: 'Primary Synthesizer',
          phase: 'thought',
          content: `Generation Round 1: Drafting baseline implementation for "${truncatedPrompt}" prioritizing core requirements.`,
        },
        {
          nodeId: 'refl-generator',
          nodeName: 'Primary Synthesizer',
          phase: 'action',
          content: 'Compiling initial code candidate in Code Sandbox.',
          toolCall: {
            name: 'Code Sandbox',
            args: { candidateVersion: 'v1.0.0-draft' },
            output: 'Compiled successfully. Ready for adversarial critique.',
          },
        },
        {
          nodeId: 'refl-critic',
          nodeName: 'Adversarial Critic',
          phase: 'critique',
          content: 'Adversarial inspection of Candidate v1.0.0: Flagged 2 critical deficiencies: 1) Session refresh token lacks rolling replay defense; 2) UI does not provide accessible ARIA live regions for biometric failure alerts.',
          toolCall: {
            name: 'Security Linter',
            args: { target: 'v1.0.0-draft', strictness: 'Adversarial' },
            output: 'Vulnerability Score: 2 High, 1 Medium. Requesting immediate revision cycle.',
          },
          isRecovery: true,
        },
        {
          nodeId: 'refl-generator',
          nodeName: 'Primary Synthesizer',
          phase: 'thought',
          content: 'Refinement Round 2: Acknowledging Critic report. Implementing rotating nonce on token refresh and injecting ARIA live annunciator in biometric view.',
        },
        {
          nodeId: 'refl-generator',
          nodeName: 'Primary Synthesizer',
          phase: 'action',
          content: 'Submitting revised Candidate v1.1.0 to Formal Verifier tool.',
          toolCall: {
            name: 'Code Sandbox',
            args: { candidateVersion: 'v1.1.0-revised' },
            output: 'Patches successfully incorporated. Token nonce rotation active.',
          },
          isRecovery: true,
        },
        {
          nodeId: 'refl-critic',
          nodeName: 'Adversarial Critic',
          phase: 'critique',
          content: 'Adversarial inspection of Candidate v1.1.0: Both security and accessibility defects successfully remediated. Rubric score: 98.4 / 100. Verification gate: APPROVED.',
        },
        {
          nodeId: 'refl-generator',
          nodeName: 'Primary Synthesizer',
          phase: 'synthesis',
          content: 'Final convergence achieved after multi-turn adversarial critique. High-assurance, provably verified deliverable ready.',
        },
      ];

    default:
      return [];
  }
}
