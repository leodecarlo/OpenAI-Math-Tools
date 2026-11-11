# Sol-Pro server

An MCP service that requests `gpt-6.1-sol` with `reasoning: {mode: "pro", effort: "max"}` through the Responses API.

## Hosting

This source was built for Sites. It expects a trusted gateway to authenticate the caller and inject or overwrite `oai-authenticated-user-id`. The presence of that header alone is not authentication on an ordinary public server. Keep the worker behind the gateway; for another host, supply its own authentication and adapt the transport before exposing paid calls.

The handler implements the Sites discovery and tool-call contract. Compatibility with other MCP clients is unverified. The hosting project ID is left unset so a new deployment can be configured.

Set `OPENAI_API_KEY` in private runtime settings. Each deployment uses its own API account. Do not put credentials in source, plugin files, or chat. This repository supplies source and a connection template; it does not publish a hosted service or a plugin directory listing.

## Tools

| Tool | Purpose |
| --- | --- |
| `sol_pro_capabilities` | Inspect model, tool policy, and configured MCP connection names. No model call. |
| `sol_pro_start` | Start work with a prompt, selected `skills`, and labelled `context`. |
| `sol_pro_get` | Retrieve a response by ID, with text, status, usage, estimated cost, and pending actions. |
| `sol_pro_continue` | Return observed browser or patch outputs, or MCP approval decisions, and continue. |

Sol-Pro can use instructions from selected skills and plugins. The chat passes instructions in `skills` and relevant material in `context`. The X plugin, for example, may supply a skill and reference PDFs whose relevant content can be passed as context.

The chat coordinates the review roles required by the selected skills.

## Model tools

Web search, Code Interpreter, image generation, computer use, and apply patch are requested by default. For computer or file-editing tasks, the calling chat or application carries out the requested actions and sends the results back to Sol-Pro. File search needs vector-store IDs; Code Interpreter file inputs need API file IDs.

GPT-6.1 Sol supports MCP tools through the Responses API. Configure remote HTTPS servers privately in `SOL_PRO_MCP_SERVERS_JSON`, then select names through `mcp_connections`. Each MCP call requires approval. Existing chat plugin connections are not inherited by the API request.

Hosted shell and native API skill references require an explicit hosted-shell request. The host must enforce that policy; `explicit_shell_request` is a caller-supplied declaration.

## Response IDs and cost

Calls use `store: true` and return response IDs for retrieval and inspection in the API Platform. After each chain, report every response's status and estimated model cost, plus the total. Repeated retrieval does not add another model call.

The estimate uses model token rates dated 2026-11-11. It excludes tool and container charges; the Platform billing record is authoritative. Check current model access, tool support, and prices for your deployment.

## Local checks

With Node.js and a Bash-compatible shell:

```sh
node scripts/smoke.mjs
npm run build
npm run validate
```

Smoke checks mock the API and do not incur model charges. They check request construction and output handling. The build checks do not verify authentication, a new deployment, or compatibility with another MCP host.
