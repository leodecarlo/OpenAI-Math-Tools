# OpenAI Math Tools

Two skills for mathematical work, plus Sol-Pro's plugin configuration and server source.

## The three tools

**[General Math Helper](skills/general-math-helper/)** sets standards for proofs, research, algorithms, and scientific code. Its philosophy is to make assumptions and derivations checkable, preserve the problem as stated, and match verification to uncertainty. Code should be readable, maintainable, stable, and efficient; convergence claims need justification. Hard or uncertain work calls for independent reviewers. Routine work stays lighter.

**[Sol_rev](skills/sol-rev/)** keeps the current chat model as principal prover and assigns two separate GPT-6.1 Sol agents to computational checking and mathematical review. Reviewers first work independently on a fixed proof version. They can ask for clarification; unclear objections receive constructive question-and-answer exchanges. The prover resolves objections, repairs the argument, and requests fresh review of changed steps. Any additional review roles remain required.

**[Sol-Pro](plugins/sol-pro/)** connects a chat to a service requesting GPT-6.1 Sol in Pro mode with max reasoning effort. Its philosophy is explicit delegation: pass the work and instructions, use tools when needed, and record the response IDs and estimated costs. The [server source](sol-pro/server/) shows how calls are made.

Computational evidence and reviewer agreement do not establish a theorem. Report what is proved and what remains uncertain.

## Use them together

Copy the two directories under `skills/` into your Codex skills directory (`~/.codex/skills/`). Invoke them with `$general-math-helper` and `$sol-rev`.

You can ask your chat to use the skills while delegating a proof or review to Sol-Pro:

> Use General Math Helper and Sol_rev, and delegate this proof or review to Sol-Pro. Coordinate the independent checks required by the skills.

The coordinating chat forwards the selected skill text, referenced standards and relevant review procedures, exact hypotheses, proof version, and accessible sources to Sol-Pro. A proof already in the chat can be forwarded as text; a separate file is optional. API calls do not inherit the whole conversation, local files, or other plugins.

The host must create and coordinate the independent reviewers. Passing Sol_rev to one Sol-Pro call does not create a review team. When combining the skills, retain General Math Helper's additional required roles and report the model and reasoning settings requested for each agent.

## Configure Sol-Pro

Use your own deployment, authentication, and API billing. The plugin folder is a connection template; replace its example endpoint. The exported server was built for Sites and depends on its trusted identity gateway. See the [setup notes](sol-pro/server/README.md).

The host executes computer and patch calls and returns actual results. Remote MCP tools require configured connections. Hosted shell requires an explicit user request. Responses include IDs and, where available, estimated model costs; tool and container charges are separate.

MIT licensed. Skill instructions are in their respective `SKILL.md` files.
