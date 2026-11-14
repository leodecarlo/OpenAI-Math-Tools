import assert from "node:assert/strict";
import handler from "../worker/index.js";

async function rpc(method, params = {}, env = {}) {
  const request = new Request("https://example.test/mcp", {
    method: "POST",
    headers: { "content-type": "application/json", "oai-authenticated-user-id": "test-user" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const response = await handler.fetch(request, env);
  assert.equal(response.status, 200);
  return (await response.json()).result;
}

const originalFetch = globalThis.fetch;
let sent;
let overrideResponse = {};
let previousTools = [{ type: "code_interpreter" }];
let posts = 0;
globalThis.fetch = async (url, options) => {
  if (options.method === "GET") {
    assert.equal(url, "https://api.openai.com/v1/responses/resp_test12345678");
    return new Response(JSON.stringify({ id: "resp_test12345678", model: "gpt-6.1-sol", tools: previousTools }), { status: 200 });
  }
  assert.equal(url, "https://api.openai.com/v1/responses");
  posts++;
  sent = JSON.parse(options.body);
  return new Response(JSON.stringify({
    id: "resp_test12345678",
    status: "completed",
    model: "gpt-6.1-sol",
    output: [{ type: "message", content: [{ type: "output_text", text: "Checked result." }] }],
    usage: { input_tokens: 4, output_tokens: 6 },
    ...overrideResponse,
  }), { status: 200, headers: { "content-type": "application/json", "x-request-id": "req_test123" } });
};
try {
  const discovery = await rpc("server/discover");
  assert.deepEqual(discovery.supportedVersions, ["2026-07-28"]);
  const listed = await rpc("tools/list");
  assert(listed.tools.some((tool) => tool.name === "sol_pro_start"));
  const capability = await rpc("tools/call", { name: "sol_pro_capabilities", arguments: {} });
  assert.equal(capability.structuredContent.api_key_configured, false);
  assert.equal(capability.structuredContent.execution_policy.default, "code_interpreter");
  const started = await rpc("tools/call", {
    name: "sol_pro_start",
    arguments: {
      prompt: "Check the identity",
      skills: [{ name: "general-math-helper", instructions: "State exact hypotheses." }],
      context: [{ label: "X plugin", content: "Relevant source result." }],
    },
  }, { OPENAI_API_KEY: "test-key" });
  assert.equal(started.structuredContent.response_id, "resp_test12345678");
  assert.equal(started.structuredContent.execution_mode, "code_interpreter");
  assert.equal(started.structuredContent.request_id, "req_test123");
  assert.equal(started.structuredContent.output_text, "Checked result.");
  assert.equal(started.structuredContent.pricing.estimated_model_usd, 0.000068);
  assert.equal(sent.model, "gpt-6.1-sol");
  assert.deepEqual(sent.reasoning, { mode: "pro", effort: "max" });
  assert.equal(sent.store, true);
  assert(sent.tools.some((tool) => tool.type === "code_interpreter"));
  assert(!sent.tools.some((tool) => tool.type === "shell"));
  assert(sent.input.includes("State exact hypotheses."));
  assert(sent.input.includes("Relevant source result."));
  overrideResponse = {};
  const shellStarted = await rpc("tools/call", {
    name: "sol_pro_start",
    arguments: {
      prompt: "Use the requested shell",
      explicit_shell_request: "Please use hosted shell",
      api_skill_references: [{ skill_id: "skill_test", version: "1" }],
    },
  }, { OPENAI_API_KEY: "test-key" });
  assert(sent.tools.some((tool) => tool.type === "shell" && tool.environment.skills[0].skill_id === "skill_test"));
  assert(!sent.tools.some((tool) => tool.type === "code_interpreter"));
  assert.equal(shellStarted.structuredContent.execution_mode, "hosted_shell");
  assert.deepEqual(shellStarted.structuredContent.attached_api_skills, { count: 1, skill_ids: ["skill_test"] });
  assert(shellStarted.structuredContent.enabled_api_tools.includes("shell"));
  assert(!shellStarted.structuredContent.enabled_api_tools.includes("code_interpreter"));
  const shellTools = sent.tools;
  const beforeReject = posts;
  const badFiles = await rpc("tools/call", { name: "sol_pro_start", arguments: { prompt: "shell", explicit_shell_request: "use shell", code_file_ids: ["file_123"] } }, { OPENAI_API_KEY: "test-key" });
  assert.equal(badFiles.isError, true);
  assert.match(badFiles.content[0].text, /code_file_ids/);
  const badSkills = await rpc("tools/call", { name: "sol_pro_start", arguments: { prompt: "skills", api_skill_references: [{ skill_id: "skill_test" }] } }, { OPENAI_API_KEY: "test-key" });
  assert.equal(badSkills.isError, true);
  assert.equal(posts, beforeReject);
  previousTools = shellTools;
  const continuedShell = await rpc("tools/call", { name: "sol_pro_continue", arguments: { response_id: "resp_test12345678", outputs: [{ type: "computer_call_output", call_id: "call_123" }] } }, { OPENAI_API_KEY: "test-key" });
  assert.equal(continuedShell.structuredContent.execution_mode, "hosted_shell");
  assert(sent.tools.some((tool) => tool.type === "shell" && tool.environment.skills[0].skill_id === "skill_test"));
  assert(!sent.tools.some((tool) => tool.type === "code_interpreter"));
  previousTools = [{ type: "code_interpreter" }];
  const badSwitch = await rpc("tools/call", { name: "sol_pro_continue", arguments: { response_id: "resp_test12345678", explicit_shell_request: "use shell", outputs: [{ type: "computer_call_output", call_id: "call_123" }] } }, { OPENAI_API_KEY: "test-key" });
  assert.equal(badSwitch.isError, true);
  previousTools = [];
  const unknownMode = await rpc("tools/call", { name: "sol_pro_continue", arguments: { response_id: "resp_test12345678", outputs: [{ type: "computer_call_output", call_id: "call_123" }] } }, { OPENAI_API_KEY: "test-key" });
  assert.equal(unknownMode.isError, true);
  previousTools = [{ type: "code_interpreter" }];
  await rpc("tools/call", {
    name: "sol_pro_start",
    arguments: { prompt: "Review supplied source", mcp_connections: ["reference_server"] },
  }, {
    OPENAI_API_KEY: "test-key",
    SOL_PRO_MCP_SERVERS_JSON: JSON.stringify({ reference_server: { server_url: "https://example.org/mcp", authorization: "Bearer test-remote-key" } }),
  });
  assert(sent.tools.some((tool) => tool.type === "mcp" && tool.server_label === "reference_server" && tool.require_approval === "always"));
  assert(sent.tools.some((tool) => tool.type === "tool_search"));
  assert(!JSON.stringify(shellStarted.structuredContent).includes("test-remote-key"));
  await rpc("tools/call", {
    name: "sol_pro_continue",
    arguments: {
      response_id: "resp_test12345678",
      outputs: [{ type: "mcp_approval_response", approval_request_id: "mcpr_test123", approve: true }],
    },
  }, { OPENAI_API_KEY: "test-key" });
  assert.equal(sent.input[0].approval_request_id, "mcpr_test123");
  assert.equal(sent.instructions.length > 0, true);
  previousTools = [{ type: "code_interpreter", container: { type: "auto", file_ids: ["file_previous"] } }];
  await rpc("tools/call", { name: "sol_pro_continue", arguments: { response_id: "resp_test12345678", outputs: [{ type: "computer_call_output", call_id: "call_123" }] } }, { OPENAI_API_KEY: "test-key" });
  assert.deepEqual(sent.tools.find((tool) => tool.type === "code_interpreter").container.file_ids, ["file_previous"]);
  overrideResponse = { output: ["shell_call", "computer_call", "apply_patch_call", "mcp_call", "mcp_approval_request", "tool_search_call"].map((type) => ({ type })) };
  const observed = await rpc("tools/call", { name: "sol_pro_start", arguments: { prompt: "Count observed calls" } }, { OPENAI_API_KEY: "test-key" });
  for (const key of ["shell_calls", "computer_calls", "apply_patch_calls", "mcp_calls", "mcp_approval_requests", "tool_search_calls"]) assert.equal(observed.structuredContent.observed_tool_usage[key], 1);
  assert.equal(observed.structuredContent.attached_api_skills.count, 0);

  overrideResponse = {};
  const mcpEnv = { OPENAI_API_KEY: "test-key", SOL_PRO_MCP_SERVERS_JSON: JSON.stringify({ reference_server: { server_url: "https://example.org/mcp", authorization: "Bearer test-remote-key" } }) };
  for (const mode of ["code_interpreter", "hosted_shell"]) {
    const result = await rpc("tools/call", { name: "sol_pro_start", arguments: { prompt: "Use retrieval and remote tools", vector_store_ids: ["vs_test"], mcp_connections: ["reference_server"], ...(mode === "hosted_shell" ? { explicit_shell_request: "Use hosted shell" } : { code_file_ids: ["file_test"] }) } }, mcpEnv);
    assert.equal(result.structuredContent.execution_mode, mode);
    assert(sent.tools.some((tool) => tool.type === "file_search" && tool.vector_store_ids[0] === "vs_test"));
    assert(sent.tools.some((tool) => tool.type === "mcp"));
    assert(sent.tools.some((tool) => tool.type === "tool_search"));
    assert(!JSON.stringify(result).includes("test-remote-key"));
    previousTools = sent.tools;
    const continued = await rpc("tools/call", { name: "sol_pro_continue", arguments: { response_id: "resp_test12345678", outputs: [{ type: "mcp_approval_response", approval_request_id: "mcpr_test", approve: true }] } }, mcpEnv);
    assert.equal(continued.structuredContent.execution_mode, mode);
    assert(sent.tools.some((tool) => tool.type === "file_search"));
    assert(sent.tools.some((tool) => tool.type === "mcp"));
    assert(!sent.tools.some((tool) => tool.type === (mode === "hosted_shell" ? "code_interpreter" : "shell")));
  }
  const beforeMissingMcp = posts;
  const badMcp = await rpc("tools/call", { name: "sol_pro_start", arguments: { prompt: "Missing MCP", mcp_connections: ["unknown"] } }, mcpEnv);
  assert.equal(badMcp.isError, true);
  assert.equal(posts, beforeMissingMcp);
  console.log("Sol-Pro MCP smoke checks passed.");
} finally {
  globalThis.fetch = originalFetch;
}
