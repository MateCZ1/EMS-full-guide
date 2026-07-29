const MAX_BODY_LENGTH = 30_000;
const MAX_REPORT_LENGTH = 25_000;
const MAX_EMBED_DESCRIPTION = 3_800;

function parseAllowedOrigins(value) {
  return new Set(
    String(value ?? "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
}

function responseHeaders(origin) {
  const headers = new Headers({
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
  });

  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Access-Control-Max-Age", "86400");
    headers.set("Vary", "Origin");
  }

  return headers;
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders(origin),
  });
}

function requiredText(value, maximum) {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized || normalized.length > maximum) return null;
  return normalized;
}

function webhookEndpoint(value) {
  try {
    const url = new URL(value);
    const isDiscordHost =
      url.hostname === "discord.com" || url.hostname.endsWith(".discord.com");
    if (
      url.protocol !== "https:" ||
      !isDiscordHost ||
      !url.pathname.startsWith("/api/webhooks/")
    ) {
      return null;
    }
    url.searchParams.set("wait", "true");
    return url.toString();
  } catch {
    return null;
  }
}

function reportFilename(generatedAt) {
  const date = new Date(generatedAt);
  const stamp = Number.isNaN(date.getTime())
    ? new Date().toISOString()
    : date.toISOString();
  return `zaznam-${stamp.replace(/[:.]/g, "-")}.txt`;
}

function buildDiscordForm(data) {
  const description =
    data.report.length <= MAX_EMBED_DESCRIPTION
      ? data.report
      : `${data.report.slice(0, MAX_EMBED_DESCRIPTION - 82)}\n\n… Úplný záznam je přiložený v textovém souboru.`;
  const filename = reportFilename(data.generatedAt);
  const payload = {
    username: "FIELD • Záznamy",
    allowed_mentions: {
      parse: [],
    },
    embeds: [
      {
        title: "Záznam o zraněné osobě",
        description,
        color: 6943195,
        fields: [
          {
            name: "Pacient",
            value: data.patientName,
            inline: true,
          },
          {
            name: "Ošetřující",
            value: data.responderName,
            inline: true,
          },
          {
            name: "Složka",
            value: data.responderUnit,
            inline: true,
          },
          {
            name: "Místo převzetí",
            value: data.location,
            inline: true,
          },
          {
            name: "Pohlaví",
            value: data.sex,
            inline: true,
          },
        ],
        timestamp: new Date(data.generatedAt).toISOString(),
        footer: {
          text: "FIELD • XABCDE",
        },
      },
    ],
    attachments: [
      {
        id: 0,
        filename,
        description: "Úplný záznam vyšetření a ošetření",
      },
    ],
  };
  const form = new FormData();
  form.set("payload_json", JSON.stringify(payload));
  form.set(
    "files[0]",
    new Blob([data.report], { type: "text/plain;charset=utf-8" }),
    filename,
  );
  return form;
}

async function handleReport(request, env, origin) {
  if (!env.DISCORD_WEBHOOK_URL) {
    return jsonResponse(
      { error: "Archiv záznamů momentálně není dostupný." },
      503,
      origin,
    );
  }

  if (!request.headers.get("Content-Type")?.includes("application/json")) {
    return jsonResponse(
      { error: "Záznam není ve správném formátu." },
      415,
      origin,
    );
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_LENGTH) {
    return jsonResponse({ error: "Záznam je příliš dlouhý." }, 413, origin);
  }

  let input;
  try {
    input = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: "Záznam nemá platný formát." }, 400, origin);
  }

  const report = requiredText(input.report, MAX_REPORT_LENGTH);
  const patientName = requiredText(input.patientName, 100);
  const responderName = requiredText(input.responderName, 80);
  const responderUnit = requiredText(input.responderUnit, 40);
  const sex = requiredText(input.sex, 30);
  const location = requiredText(input.location, 80);
  const generatedAt = Number(input.generatedAt);
  const generatedDate = new Date(generatedAt);

  if (
    !report ||
    !patientName ||
    !responderName ||
    !responderUnit ||
    !sex ||
    !location ||
    !Number.isFinite(generatedAt) ||
    Number.isNaN(generatedDate.getTime())
  ) {
    return jsonResponse(
      { error: "Záznam neobsahuje všechny povinné údaje." },
      400,
      origin,
    );
  }

  const discordUrl = webhookEndpoint(env.DISCORD_WEBHOOK_URL);
  if (!discordUrl) {
    return jsonResponse(
      { error: "Archiv záznamů momentálně není správně nastavený." },
      503,
      origin,
    );
  }

  const discordResponse = await fetch(discordUrl, {
    method: "POST",
    body: buildDiscordForm({
      report,
      patientName,
      responderName,
      responderUnit,
      sex,
      location,
      generatedAt,
    }),
  });

  if (!discordResponse.ok) {
    console.error("Discord webhook rejected a report", {
      status: discordResponse.status,
    });
    return jsonResponse(
      { error: "Archiv záznam nepřijal. Zkuste to znovu později." },
      502,
      origin,
    );
  }

  const discordMessage = await discordResponse.json().catch(() => null);
  return jsonResponse(
    {
      ok: true,
      messageId:
        discordMessage && typeof discordMessage.id === "string"
          ? discordMessage.id
          : null,
    },
    200,
    origin,
  );
}

const discordBridge = {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return jsonResponse(
        {
          ok: true,
          service: "FIELD archive service",
          configured: Boolean(env.DISCORD_WEBHOOK_URL),
        },
        200,
        null,
      );
    }

    if (url.pathname !== "/reports") {
      return jsonResponse({ error: "Nenalezeno." }, 404, null);
    }

    const origin = request.headers.get("Origin") ?? "";
    const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
    if (!origin || !allowedOrigins.has(origin)) {
      return jsonResponse(
        { error: "Odesílání z této adresy webu není povolené." },
        403,
        null,
      );
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: responseHeaders(origin),
      });
    }

    if (request.method !== "POST") {
      return jsonResponse(
        { error: "Tato metoda není podporovaná." },
        405,
        origin,
      );
    }

    return handleReport(request, env, origin);
  },
};

export default discordBridge;
