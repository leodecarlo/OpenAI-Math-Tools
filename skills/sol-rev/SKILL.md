---
name: sol-rev
description: "Coordinate a mathematical proof with a principal prover and separate GPT-6.1 Sol agents for computational checking and independent mathematical review."
---

# Sol_rev

Apply this coordination layer to the user's mathematical task. Preserve the supplied sources, notation, available tools, output requirements, and required verification roles.

## Requested instructions

Use the current chat model as coordinator and principal prover. Follow the same instructions regardless of its model identity, and disclose that identity.

Explicitly delegate to separate GPT-6.1 Sol agents:

1. Computational checking: independently rederive important calculations and run appropriate symbolic, exact, or numerical checks. Explain what each check establishes.
2. Mathematical review: inspect the candidate proof for unsupported steps, hidden assumptions, missing cases, and incorrect theorem applications. Suggest concrete repairs and improvements.

Retain any additional verification roles required by the task or project instructions.

Give the reviewers the exact hypotheses, relevant sources, and a fixed version of the proof. Collect their reports independently before reconciling their findings.

During its initial review, either reviewer may ask the principal prover as many clarification questions as needed before submitting its independent report. The prover should answer against the stated hypotheses and proof version. If an answer changes either, identify a new version for review. Do not share the other reviewer's findings during this exchange.

If the coordinator doubts a review finding or needs to understand it better, have the coordinator and that reviewer exchange two constructive question-and-reply rounds through agent messages before reconciliation. The coordinator asks a precise question in each round; the reviewer answers with reasons, evidence, or a correction. Keep the proof version explicit and report any uncertainty that remains.

The coordinator should assess objections, revise the argument, and obtain fresh review of affected steps. Report unresolved gaps and distinguish a proof from computational evidence.

Report the model and reasoning setting actually requested for each agent. If the requested combination is unavailable, tell me before substituting another.

## Apply the model assignments honestly

- Report the current chat model's verified identity, or say when it cannot be verified. The two separate checking and review agents each use an explicit `gpt-6.1-sol` model request. This skill cannot change the current chat's model.
- Use the user's explicitly requested reasoning settings. Otherwise retain the host's resolved defaults; this skill imposes no Max or Ultra setting. Report a missing effort override as `default (no explicit override requested)`, rather than inventing an effective setting. Distinguish requested settings from any effective settings that the host actually reports.
- Use two distinct assisting agents. If the host requires fresh context for model overrides, start fresh agents with explicit model settings and supply the complete bounded review packet. Do not silently fall back to inherited coordinator-model agents, another Sol version, another reasoning setting, or self-review. Explain unavailable capabilities before any substitution.
- Include only sources actually accessible to each agent. Identify the fixed proof version and give each agent a separate report destination when using files. Obtain independent initial reports before sharing objections. Recheck changed steps against the revised version.
- These orchestration instructions address the principal prover. A delegated Sol agent performs its assigned checking or review task and returns its findings; it does not take over the coordinator role or recursively start another proof team unless explicitly assigned that work.
