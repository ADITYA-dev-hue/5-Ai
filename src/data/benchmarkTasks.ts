import { BenchmarkTask } from '../types';

export const BENCHMARK_TASKS: BenchmarkTask[] = [
  {
    id: 'task-fintech-privacy',
    title: 'Fintech Privacy & Ledger Tracker',
    category: 'Security & Auth',
    difficulty: 'Advanced',
    prompt: 'Build a fintech tracking app with bank-level privacy, client-side encryption, double-entry ledger bookkeeping, and biometric authentication session management.',
    description: 'Demands simultaneous compliance with cryptographic security standards, transactional integrity (ACID compliance in client store), and clean UI state orchestration.',
    evalMetric: 'Cryptographic isolation, audit trail verification, zero data leak guarantee',
  },
  {
    id: 'task-distributed-consensus',
    title: 'Distributed Consensus Protocol Engine',
    category: 'System Design',
    difficulty: 'Challenging',
    prompt: 'Design and implement a Raft-inspired distributed consensus protocol simulator supporting leader election, log replication, heartbeat heart-checks, and partitioned network recovery.',
    description: 'Tests multi-agent system decomposition, concurrency handling, state machine safety invariants, and fault injection recovery.',
    evalMetric: 'Safety under network partitions, leader election latency, log convergence',
  },
  {
    id: 'task-financial-anomaly',
    title: 'Real-Time Financial Anomaly Detector',
    category: 'Financial & Analytics',
    difficulty: 'Advanced',
    prompt: 'Synthesize an adaptive streaming anomaly detector that monitors high-frequency transactional data, calculates rolling statistical z-scores, flags fraudulent clusters, and surfaces live visual alerts.',
    description: 'Evaluates algorithm synthesis, rolling time-window memory management, mathematical precision, and low-latency stream processing.',
    evalMetric: 'False discovery rate (<1.5%), detection latency (<50ms), throughput resilience',
  },
  {
    id: 'task-jwt-rate-limit-gateway',
    title: 'Zero-Trust JWT Auth & Rate-Limiter Gateway',
    category: 'Security & Auth',
    difficulty: 'Standard',
    prompt: 'Implement a zero-trust API gateway middleware featuring rotating asymmetric RSA keys, sliding token-bucket rate limiting, structured audit logging, and automated threat IP banning.',
    description: 'Benchmarks standard microservice infrastructure patterns, defensive coding, structured header parsing, and DDoS mitigation logic.',
    evalMetric: 'Replay attack prevention, token validation overhead, burst rate-limiting accuracy',
  },
];
