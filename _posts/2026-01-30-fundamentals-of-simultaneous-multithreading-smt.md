---
layout: post
title: Fundamentals of Simultaneous Multithreading (SMT)
author: Mukesh Kumar Chaurasiya
categories: [fundamentals, multithreading, smt]
tags: [fundamentals, multithreading, smt, cpu-architecture, performance]
image: smt-fundamentals/smt-explanation.jpg
date: 2026-01-30 21:42 +0530
---
# Abstract

Modern processors frequently underutilize execution resources due to
pipeline stalls caused by cache misses, branch mispredictions, and
limited instruction-level parallelism. Simultaneous Multithreading
(SMT) enables multiple hardware threads to share a single processor
core, improving resource utilization and overall throughput. This
blog surveys the architectural foundations of SMT and evaluates its
performance implications on power processors. We analyze throughput
gains, resource contention, and fairness trade-offs using representative
workloads, and discuss limitations related to cache contention and
security vulnerabilities.

# I. Introduction

Modern superscalar processors are designed to exploit instruction-level
parallelism (ILP) to improve performance. However, practical workloads
often fail to fully utilize available execution resources due to pipeline
stalls caused by memory latency, control hazards, and data dependencies.

Simultaneous Multithreading (SMT) addresses this limitation by allowing
multiple independent hardware threads to issue instructions concurrently
within a single core. By overlapping stalls from one thread with useful
work from another, SMT improves overall throughput without duplicating
execution resources.

# II. Background and Related Work

Tullsen et al. first introduced SMT as a technique to improve processor
utilization by issuing instructions from multiple threads in the same
cycle [1]. Subsequent implementations, such as IBM POWER SMT and
Intel Hyper-Threading have demonstrated the practicality of SMT in commercial
processors.

Prior work has examined SMT scheduling policies, cache contention, and
fairness issues. Recent studies have also explored security implications
arising from shared microarchitectural resources.


# III. SMT Architecture

## A. Key concepts

**Physical Core vs Logical Core:**
- A **physical core** is the actual hardware processing unit
- A **logical core** (or hardware thread) is what the OS sees and can schedule work to
- With SMT, one physical core can present multiple logical cores (typically 2 or 4)

**Resource Sharing:**
SMT works by sharing various CPU resources among threads:
- Execution units (ALU, FPU, etc.)
- Caches (L1, L2, L3)
- Branch prediction units
- Memory management units

![Power9 Topology](/assets/img/smt-fundamentals/topology.jpg)

This is a topology from a power9 processor. Each Physical core has 4 SMT threads with dedicated L1 cache. L2 and L3 cache is being shared by 2 cores hence for rest of the blog we will call a core with 4 SMT threads as small core and 2 small cores as big core. We can say that a big core is a completely independent smallest unit in the processor core. Each big core has 8 SMT threads, 2 units of each compute unit, 2 set of L1 cache and 1 set of L2 and L3 cache.

**In summary:**

- Each Big core has 2 small cores shared L2 and L3 cache between 2 small cores.
- Each small core has individual compute units and L1 cache.

# IV. Experimental Methodology

Our evaluation considers an SMT-capable processor with eight hardware threads per big core (SMT8). We will keep the processor in SMT1(or single thread (ST)) mode, and then gear up with SMT2, SMT4 and SMT8 modes and check the throughput in a particular time span. Throughtout the experiments we will cosider the time span of the experiments to be fixed at 60 secs. The processor has 10 big cores on the same socket. We will use 80 stress-ng threads in each smt modes and see the performance.

