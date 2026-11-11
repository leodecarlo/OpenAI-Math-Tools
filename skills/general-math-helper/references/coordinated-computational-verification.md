# Computational verification team

For a hard or uncertain mathematical implementation, the coordinator automatically engages five distinct reviewers:

- An algorithm reviewer.
- An implementation reviewer.
- An independent validation reviewer, who derives expected results without relying on the implementation.
- A numerical, stochastic, or exact-computation specialist, as appropriate to the task.
- An adversarial reviewer.

Including the coordinator, this is six distinct agents. Stage agents if concurrent capacity is limited.

Give reviewers the specification, assumptions, relevant accessible sources, and a fixed version of the implementation. Obtain independent initial findings and checks that can detect errors in the actual task. Ask each reviewer to report evidence, objections, and limitations.

Reconcile findings on mathematical merit, verify repairs, and recheck affected steps after revisions. Report the actual roles covered and what the evidence establishes. If required independent reviewers are unavailable, disclose the missing roles and do not call self-review independent. Tests and numerical agreement do not establish general correctness or convergence.
