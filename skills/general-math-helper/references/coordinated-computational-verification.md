# Implementation and verification team

For a hard or uncertain mathematical implementation, the Main agent automatically engages seven distinct agents:

- Two developers who implement the numerical methods, with tasks divided by the Main agent.
- An algorithm reviewer.
- An efficiency explorer, who compares alternative algorithms and implementations for speed and resource use while preserving the required correctness and accuracy. Support performance recommendations with complexity analysis or relevant benchmarks when practical.
- Two adversarial reviewers, each independently searching for failure cases, incorrect results, and unsupported correctness or convergence claims.
- A neuro-symbolic verifier, who explores uncertain proof steps and checks selected identities or lemmas with exact symbolic tools. State what each check establishes and under which assumptions.

Including the Main agent, this is eight distinct agents. Stage agents if concurrent capacity is limited.

Give all agents the specification, assumptions, and relevant accessible sources. Once the implementation is ready, give reviewers a fixed version. Collect their initial reports independently, with checks that can detect errors in the actual task. Ask each reviewer to report evidence, objections, and limitations.

Reconcile findings on mathematical merit, verify repairs, and recheck affected steps after revisions. Report the actual roles covered and what the evidence establishes. If required independent reviewers are unavailable, disclose the missing roles and do not call self-review independent. Tests and numerical agreement do not establish general correctness or convergence.
