---
name: sol-rev
description: "Coordinate proofs and numerical-method implementation checks with separate GPT-6.2 Sol agents for computational checking and independent review. Proof reviews also use a neuro-symbolic verifier."
---

# Sol_rev

Apply this coordination layer to the user's mathematical task. Preserve the supplied sources, notation, available tools, output requirements, and required verification roles.

## Requested instructions

Use the current chat model as the Main agent, leading the proof or implementation review. Follow the same instructions regardless of its model identity, and disclose that identity.

Delegate to three separate GPT-6.2 Sol agents for proofs and two for numerical-method implementation checks.

For proofs:

1. Computational checking: independently rederive important calculations and run appropriate symbolic, exact, or numerical checks. Explain what each check establishes.
2. Mathematical review: inspect the candidate proof for unsupported steps, hidden assumptions, missing cases, and incorrect theorem applications. Suggest concrete repairs and improvements.
3. A neuro-symbolic verifier, who explores uncertain proof steps and checks selected identities or lemmas with exact symbolic tools. State what each check establishes and under which assumptions.

For numerical-method implementation checks:

1. **Computational checking:** independently validate calculations and numerical results using appropriate reference solutions, convergence studies, conservation checks, edge cases, and sensitivity to numerical tolerances. Explain what each check establishes.
2. **Mathematical and implementation review:** inspect the method's assumptions and derivation, verify that the code implements the stated scheme and examine claims about correctness, stability, and convergence. Suggest concrete repairs.

Retain any additional verification roles required by the task or project instructions.

Give the reviewers the exact claim or specification, hypotheses, relevant sources, and a fixed version of the proof or code. Collect their reports independently before reconciling their findings.

During its initial review, any reviewer may ask the Main agent as many clarification questions as needed before submitting its independent report. The Main agent should answer against the stated hypotheses, specification, and version under review. If an answer changes any of these, identify a new version for review. Do not share other reviewers' findings during this exchange.

If the Main agent doubts a review finding or needs to understand it better, have the Main agent and that reviewer exchange two constructive question-and-reply rounds through agent messages before reconciliation. The Main agent asks a precise question in each round; the reviewer answers with reasons, evidence, or a correction. Keep the version under review explicit and report any uncertainty that remains.

The Main agent should assess objections, revise the proof or implementation, and obtain fresh review of affected steps. Report unresolved gaps and distinguish a proof from computational evidence.

Report the model and reasoning setting actually requested for each agent. If the requested combination is unavailable, tell me before substituting another.

## Apply the model assignments honestly

- Report the current chat model's verified identity, or say when it cannot be verified. Explicitly request `gpt-6.2-sol` for each reviewer. This skill cannot change the current chat's model.
- Use the user's explicitly requested reasoning settings. Otherwise retain the host's resolved defaults; this skill imposes no Max or Ultra setting. Report a missing effort override as `default (no explicit override requested)`, rather than inventing an effective setting. Distinguish requested settings from any effective settings that the host actually reports.
- Use a distinct assisting agent for each listed role. If the host requires fresh context for model overrides, start fresh agents with explicit model settings and supply the complete bounded review packet. Do not silently fall back to agents inheriting the Main agent's model, another Sol version, another reasoning setting, or self-review. Explain unavailable capabilities before any substitution.
- Include only sources actually accessible to each agent. Identify the version under review and give each agent a separate report destination when using files. Obtain independent initial reports before sharing objections. Recheck changed steps against the revised version.
- These orchestration instructions address the Main agent. A delegated Sol agent performs its assigned checking or review task and returns its findings; it does not take over the Main agent role or recursively start another verification team unless explicitly assigned that work.
