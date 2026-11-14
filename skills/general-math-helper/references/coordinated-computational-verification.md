# Computational verification team

For a hard or uncertain mathematical implementation, the coordinator automatically engages five distinct agents:

- An algorithm reviewer.
- An implementation reviewer.
- An efficiency explorer, who compares alternative algorithms and implementations for speed and resource use while preserving the required correctness and accuracy. Support performance recommendations with complexity analysis or relevant benchmarks when practical.
- Two adversarial reviewers, each independently searching for failure cases, incorrect results, and unsupported correctness or convergence claims.

Including the coordinator, this is six distinct agents. Stage agents if concurrent capacity is limited.

Give agents the specification, assumptions, relevant accessible sources, and a fixed version of the implementation. Obtain independent initial findings and checks that can detect errors in the actual task. Ask each agent to report evidence, objections, and limitations.

Reconcile findings on mathematical merit, verify repairs, and recheck affected steps after revisions. Report the actual roles covered and what the evidence establishes. If required independent reviewers are unavailable, disclose the missing roles and do not call self-review independent. Tests and numerical agreement do not establish general correctness or convergence.
