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

Sol-Pro can use instructions from selected skills and plugins. The chat forwards those instructions, relevant references, exact hypotheses, proof version, and accessible sources along with the task. A proof already in the chat can be forwarded as text; a separate file is optional.

The chat coordinates the review roles required by the selected skills and reports the model and reasoning settings requested for each agent.

## Configure Sol-Pro

To use Sol-Pro, create your own OpenAI API key and set up billing for your API account. Configure your Sol-Pro service with the key and connect the plugin to it.

Sol-Pro can use GPT-6.1 Sol's Responses API tools: web search, file search, image generation, Code Interpreter, computer use, apply patch, skills, MCP, tool search, and hosted shell. File search requires configuration. Remote MCP tools require configured connections. Tool search is enabled when an MCP connection is selected. Hosted shell and native API skills require an explicit shell request.

Sol-Pro reports response IDs and, when available, estimated model costs. Tool and container charges may be additional.

MIT licensed. Skill instructions are in their respective `SKILL.md` files.

## Connect your API key

1. Create a key on the [OpenAI API keys page](https://platform.openai.com/api-keys) and enable billing for its API project.
2. In the private settings of the service hosting Sol-Pro, add a secret named `OPENAI_API_KEY` and paste your key as its value. For Sites, use the Site's runtime environment settings.
3. Save the setting and redeploy Sol-Pro. The server reads the key automatically; no script changes are needed.
4. Connect the plugin to your service by replacing the example endpoint in `plugins/sol-pro/mcp.json` with your service's MCP URL.
5. Ask the chat to check `sol_pro_capabilities`. The result `api_key_configured: true` confirms that a key is present. Then ask Sol-Pro to reply "OK" to test that the key and model access work; this makes a billable API call.

Keep the key in private settings, outside GitHub and the plugin package. Calls from your Sol-Pro service are billed to the API project associated with that key.
