# OpenAI Math Tools

Two skills for mathematical work, plus Sol-Pro's plugin.

## The three tools

**[General Math Helper](skills/general-math-helper/)** sets standards for proofs, research, algorithms, and scientific code. Its philosophy is to make assumptions and derivations checkable, preserve the problem as stated, and match verification to uncertainty. Code should be readable, maintainable, stable, and efficient; convergence claims need justification. Hard or uncertain work calls for independent reviewers. Routine work stays lighter.

**[Sol_rev](skills/sol-rev/)** keeps the current chat model as principal prover and assigns two separate GPT-6.1 Sol agents to computational checking and mathematical review. Reviewers first work independently on a fixed proof version. They can ask for clarification; unclear objections receive constructive question-and-answer exchanges. The prover resolves objections, repairs the argument, and requests fresh review of changed steps. Any additional review roles remain required.

**[Sol-Pro](plugins/sol-pro/)** connects a chat to a service requesting GPT-6.1 Sol in Pro mode with max reasoning effort. Its philosophy is explicit delegation: pass the work and instructions, use tools when needed, and record the response IDs and estimated costs. The [server source](sol-pro/server/) shows how calls are made.


## Use them together


You can ask your chat to use the skills while delegating a proof or review to Sol-Pro:

> Use General Math Helper and Sol_rev, and delegate this proof or review to Sol-Pro. Coordinate the independent checks required by the skills.

Sol-Pro can use instructions from selected skills and plugins. The chat forwards those instructions, relevant references, exact hypotheses, proof version, and accessible sources along with the task. A proof already in the chat can be forwarded as text; a separate file is optional.

The chat coordinates the review roles required by the selected skills and reports the model and reasoning settings requested for each agent.

## Configure Sol-Pro and available tools

Sol-Pro uses your own OpenAI API key and API billing. The steps below explain how to connect your key.

Sol-Pro can use GPT-6.1 Sol's Responses API tools: web search, file search, image generation, Code Interpreter, computer use, apply patch, skills, MCP, tool search, and hosted shell. File search requires configuration. Remote MCP tools require configured connections. Tool search is enabled when an MCP connection is selected. Hosted shell and native API skills require an explicit shell request.

Sol-Pro reports response IDs and, when available, estimated model costs. Tool and container charges may be additional.

MIT licensed. Skill instructions are in their respective `SKILL.md` files.

### Connect your API key

1. Create a key on the [OpenAI API keys page](https://platform.openai.com/api-keys) and enable billing for its API project.
2. Save the key in a private text file on your computer, for example `sol-pro-key.txt`. The file should contain only the key and stay outside this repository.
3. Open this repository in Codex and send this request, replacing the placeholder with the full path to your file:

> Set up my copy of Sol-Pro using the OpenAI API key saved in `<full path to sol-pro-key.txt>`. Read the key without displaying it, configure Sol-Pro to use it, and verify the connection with a short API call. Keep the key out of GitHub.

Codex handles the setup and supplies the key as `OPENAI_API_KEY`, which Sol-Pro's code already reads. Sol-Pro does not automatically read your text file; Codex must complete the setup before you can use the plugin.

The test and later API calls are billed to the API project associated with your key.

## Invoke skills and plugins in chat

Once installed, type `$` for a skill or `@` for a plugin, then select its name from the suggestions:

| Type | Examples |
| --- | --- |
| Skill | `$general-math-helper`, `$sol-rev` |
| Plugin | `@Sol-Pro` |

Add your request after selecting them. You can combine skills and plugins in the same message:

> `$general-math-helper $sol-rev @Sol-Pro` Use these skills and delegate the following proof or review to Sol-Pro: …
