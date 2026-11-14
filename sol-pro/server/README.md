# Sol-Pro server

Sol-Pro delegates work to GPT-6.1 Sol in Pro mode with max reasoning effort.

## Use Sol-Pro

Select `@Sol-Pro`, describe your task, and name any skills or sources you want included. Your chat passes the relevant instructions and material, coordinates the work, and returns the result with response IDs and estimated model costs.

Web search, image generation, Code Interpreter, computer use, and file editing (apply patch) are available by default. The calling chat carries out computer and file-editing actions and returns what happened.

File search needs files prepared for searching. Selected skill instructions can accompany any task. Skills loaded into hosted shell need an explicit shell request.

For hosted shell, say:

> Use Sol-Pro with hosted shell for this task.

Shell replaces Code Interpreter for that task, including follow-up steps. MCP connections are set up separately; tool search finds tools within the selected connections. Other chat plugins are not connected automatically: the chat can pass their relevant instructions and results.

## Set up your copy

Follow the [API key setup guide](../../README.md#connect-your-api-key). This source is designed for private Sites hosting. A different host must authenticate users before allowing paid calls.

Keep your key in private runtime settings, outside source files, plugin packages, and chat. This repository provides source and a connection template; it does not provide a ready-to-use hosted service. Check the connection after setting up a new deployment.

## Costs and checks

Sol-Pro reports estimated model costs and tool activity. Tool and container charges may be additional; your OpenAI Platform billing record gives the final charge. Checking an existing response again does not start another model call.

The included checks use simulated API responses and incur no model charges. They check the configuration and response handling; a new deployment still needs its own connection check.
