import assert from "node:assert/strict";
import test from "node:test";
import discordBridge from "../discord-bridge/src/index.js";

const allowedOrigin = "https://matecz1.github.io";
const bridgeEnvironment = {
  ALLOWED_ORIGINS: allowedOrigin,
  DISCORD_WEBHOOK_URL:
    "https://discord.com/api/webhooks/123456789/example-token",
};
const validReport = {
  report:
    "**ZÁZNAM O ZRANĚNÉ OSOBĚ**\n\n**Ošetřující EMS:** Alex Stone",
  patientName: "John Doe",
  responderName: "Alex Stone",
  sex: "Muž",
  location: "Los Santos",
  generatedAt: Date.UTC(2026, 6, 28, 14, 30, 0),
};

function reportRequest() {
  return new Request("https://bridge.example/reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: allowedOrigin,
    },
    body: JSON.stringify(validReport),
  });
}

test("Discord bridge sends a report with a full text attachment", async () => {
  const originalFetch = globalThis.fetch;
  let capturedRequest;
  globalThis.fetch = async (input, init) => {
    capturedRequest = { input, init };
    return new Response(JSON.stringify({ id: "discord-message-id" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  try {
    const response = await discordBridge.fetch(
      reportRequest(),
      bridgeEnvironment,
    );
    const responseBody = await response.json();

    assert.equal(response.status, 200);
    assert.equal(responseBody.ok, true);
    assert.match(String(capturedRequest.input), /wait=true/);
    assert.equal(capturedRequest.init.method, "POST");

    const form = capturedRequest.init.body;
    const payload = JSON.parse(form.get("payload_json"));
    const attachment = form.get("files[0]");

    assert.deepEqual(payload.allowed_mentions, { parse: [] });
    assert.equal(payload.embeds[0].fields[1].value, "Alex Stone");
    assert.equal(payload.embeds[0].fields[2].value, "Los Santos");
    assert.match(attachment.name, /^zaznam-/);
    assert.equal(await attachment.text(), validReport.report);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Discord bridge rejects requests from an unapproved website", async () => {
  const request = new Request("https://bridge.example/reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://untrusted.example",
    },
    body: JSON.stringify(validReport),
  });
  const response = await discordBridge.fetch(request, bridgeEnvironment);

  assert.equal(response.status, 403);
});
