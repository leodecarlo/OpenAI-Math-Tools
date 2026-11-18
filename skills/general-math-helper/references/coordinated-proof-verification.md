# Proof verification team

For a hard or uncertain proof, the Main agent automatically engages at least seven distinct reviewers:

- One computation checker.
- One counterexample finder.
- At least two alternative proof-path explorers, each pursuing a distinct approach.
- A neuro-symbolic verifier, who explores uncertain proof steps and checks selected identities or lemmas with exact symbolic tools. State what each check establishes and under which assumptions.
- At least two adversarial checkers, each independently examining the proof.

Including the Main agent, this is at least eight distinct agents. Stage agents if concurrent capacity is limited.

Give reviewers the exact claim, hypotheses, relevant accessible sources, and a fixed version of the proof. Explorers start from the claim and sources independently; adversarial checkers independently inspect the same proof before comparing findings. Ask each to report evidence, objections, and limitations.

Reconcile findings on mathematical merit, verify proposed counterexamples against the hypotheses and check repairs, and obtain fresh checks of affected steps after revisions. Report the actual roles covered and distinguish proved, conditional, disproved, and open claims. If required independent reviewers are unavailable, disclose the missing roles and do not call self-review independent. Agent agreement and computational evidence do not prove a theorem.
