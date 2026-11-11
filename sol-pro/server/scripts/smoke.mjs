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
globalThis.fetch = async (url, options) => {
  assert.equal(url, "https://api.openai.com/v1/responses");
  sent = JSON.parse(options.body);
  return new Response(JSON.stringify({
    id: "resp_test12345678",
    status: "completed",
    model: "gpt-6.1-sol",
    output: [{ type: "message", content: [{ type: "output_text", text: "Checked result." }] }],
    usage: { input_tokens: 4, output_tokens: 6 },
  }), { status: 200, headers: { "content-type": "application/json", "x-request-id": "req_test123" } });
};
try {
  const discovery = await rpc("server/discover");
  assert.deepEqual(discovery.supportedVersions, ["2026-07-28"]);
  const listed = await rpc("tools/list");
  assert(listed.tools.some((tool) => tool.name === "sol_pro_start"));
  const capability = await rpc("tools/call", { name: "sol_pro_capabilities", arguments: {} });
  assert.equal(capability.structuredContent.api_key_configured, false);
  const started = await rpc("tools/call", {
    name: "sol_pro_start",
    arguments: {
      prompt: "Check the identity",
      skills: [{ name: "general-math-helper", instructions: "State exact hypotheses." }],
      context: [{ label: "X plugin", content: "Relevant source result." }],
    },
  }, { OPENAI_API_KEY: "test-key" });
  assert.equal(started.structuredContent.response_id, "resp_test12345678");
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
  await rpc("tools/call", {
    name: "sol_pro_start",
    arguments: {
      prompt: "Use the requested shell",
      explicit_shell_request: "Please use hosted shell",
      api_skill_references: [{ skill_id: "skill_test", version: "1" }],
    },
  }, { OPENAI_API_KEY: "test-key" });
  assert(sent.tools.some((tool) => tool.type === "shell" && tool.environment.skills[0].skill_id === "skill_test"));
  await rpc("tools/call", {
    name: "sol_pro_start",
    arguments: { prompt: "Review supplied source", mcp_connections: ["reference_server"] },
  }, {
    OPENAI_API_KEY: "test-key",
    SOL_PRO_MCP_SERVERS_JSON: JSON.stringify({ reference_server: { server_url: "https://example.org/mcp", authorization: "Bearer test-remote-key" } }),
  });
  assert(sent.tools.some((tool) => tool.type === "mcp" && tool.server_label === "reference_server" && tool.require_approval === "always"));
  assert(sent.tools.some((tool) => tool.type === "tool_search"));
  await rpc("tools/call", {
    name: "sol_pro_continue",
    arguments: {
      response_id: "resp_test12345678",
      outputs: [{ type: "mcp_approval_response", approval_request_id: "mcpr_test123", approve: true }],
    },
  }, { OPENAI_API_KEY: "test-key" });
  assert.equal(sent.input[0].approval_request_id, "mcpr_test123");
  assert.equal(sent.instructions.length > 0, true);
  console.log("Sol-Pro MCP smoke checks passed.");
} finally {
  globalThis.fetch = originalFetch;
}
