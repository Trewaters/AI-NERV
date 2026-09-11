#!/usr/bin/env node
// MCP server (stdio, newline-delimited JSON-RPC 2.0) exposing this harness
// read-only: instruction fragments, stack packs, skills, and the long-form
// references. Also renders the combined instruction file for a pack without
// writing anything to disk.
//
// Node standard library only — the same constraint the hooks in hooks/ follow,
// so the plugin installs with no npm step.
//
// Declared by mcp.json as: node ./scripts/harness-mcp.js
"use strict";

const fs = require("fs");
const path = require("path");

const CORE_DIR = path.dirname(__dirname);
const FRAGMENTS_DIR = path.join(CORE_DIR, "fragments");
const PACKS_DIR = path.join(FRAGMENTS_DIR, "packs");
const SKILLS_DIR = path.join(CORE_DIR, "skills");
const REFERENCES_DIR = path.join(CORE_DIR, "references");

const SERVER_INFO = { name: "ai-harness-core", version: "1.0.0" };
const DEFAULT_PROTOCOL = "2024-11-05";

// --- filesystem helpers -----------------------------------------------------

// Every caller-supplied path is resolved inside CORE_DIR; anything that escapes
// (../, an absolute path) is rejected rather than read, so a prompt-injected
// argument cannot turn this into an arbitrary file reader.
function safeResolve(relPath) {
  const resolved = path.resolve(CORE_DIR, String(relPath || ""));
  const rel = path.relative(CORE_DIR, resolved);
  if (rel === "" || rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("path escapes the harness root: " + relPath);
  }
  return resolved;
}

function readText(absPath) {
  return fs.readFileSync(absPath, "utf8");
}

function listMarkdown(dir) {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
}

function listDirs(dir) {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
}

// --- content helpers --------------------------------------------------------

// Minimal front-matter reader: the SKILL.md files use flat `key: value` pairs
// only, so this deliberately does not pull in a YAML parser.
function parseFrontMatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) return {};
  const out = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let value = kv[2].trim();
    const quoted =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"));
    if (quoted && value.length > 1) value = value.slice(1, -1);
    out[kv[1]] = value;
  }
  return out;
}

function firstParagraph(text) {
  const body = text.replace(/^#.*\r?\n/, "").trim();
  return body.split(/\r?\n\r?\n/)[0].replace(/\s+/g, " ").trim();
}

// Mirrors the header scripts/build-instructions.sh writes. That script is the
// one that actually generates files; build_instructions below only previews it.
const GENERATED_HEADER = [
  "<!--",
  "  GENERATED FILE - do not edit directly.",
  "  Edit fragments in .harness-core/fragments/ (shared) or ai/fragments/ (this repo),",
  "  then run: bash .harness-core/scripts/build-instructions.sh",
  "-->",
].join("\n");

// --- tools ------------------------------------------------------------------

const TOOLS = [
  {
    name: "list_fragments",
    description:
      "List the instruction fragments in this harness. Shared fragments are concatenated into every generated CLAUDE.md / AGENTS.md / copilot-instructions.md; pack fragments are opt-in per stack.",
    inputSchema: {
      type: "object",
      properties: {
        scope: {
          type: "string",
          enum: ["shared", "packs", "all"],
          description: "Which fragments to list. Defaults to 'all'.",
        },
      },
      additionalProperties: false,
    },
    run(args) {
      const scope = args.scope || "all";
      const lines = [];
      if (scope === "shared" || scope === "all") {
        lines.push("Shared fragments (always emitted, in this order):");
        for (const name of listMarkdown(FRAGMENTS_DIR)) {
          lines.push("  fragments/" + name);
        }
      }
      if (scope === "packs" || scope === "all") {
        if (lines.length) lines.push("");
        lines.push("Pack fragments (opt-in per stack):");
        for (const pack of listDirs(PACKS_DIR)) {
          if (pack.startsWith("_")) continue;
          lines.push("  " + pack + "/");
          for (const name of listMarkdown(path.join(PACKS_DIR, pack))) {
            if (name === "README.md") continue;
            lines.push("    fragments/packs/" + pack + "/" + name);
          }
        }
      }
      return lines.join("\n");
    },
  },
  {
    name: "read_fragment",
    description:
      "Read one instruction fragment in full, by the repo-relative path returned from list_fragments (e.g. 'fragments/20-security.md').",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string", description: "Repo-relative path under fragments/." },
      },
      required: ["path"],
      additionalProperties: false,
    },
    run(args) {
      const abs = safeResolve(args.path);
      if (!abs.startsWith(FRAGMENTS_DIR + path.sep)) {
        throw new Error("read_fragment only reads paths under fragments/");
      }
      return readText(abs);
    },
  },
  {
    name: "list_packs",
    description:
      "List the stack-specific fragment packs (react-vite-spa, electron-react-mui, hugo-theme, ...) with a one-line summary of each, to pick the right pack for a repo.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run() {
      const out = [];
      for (const pack of listDirs(PACKS_DIR)) {
        if (pack.startsWith("_")) continue;
        let summary = "(no README)";
        try {
          summary = firstParagraph(readText(path.join(PACKS_DIR, pack, "README.md")));
        } catch {
          // A pack without a README still lists — its fragment names describe it.
        }
        const count = listMarkdown(path.join(PACKS_DIR, pack)).filter(
          (n) => n !== "README.md"
        ).length;
        out.push(pack + " (" + count + " fragments)\n  " + summary);
      }
      return out.join("\n\n");
    },
  },
  {
    name: "list_skills",
    description:
      "List the skills this harness ships, with the description that decides when each one applies.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run() {
      const out = [];
      for (const dir of listDirs(SKILLS_DIR)) {
        if (dir.startsWith("_")) continue;
        let fm = {};
        try {
          fm = parseFrontMatter(readText(path.join(SKILLS_DIR, dir, "SKILL.md")));
        } catch {
          continue;
        }
        const hint = fm["argument-hint"] ? "\n  args: " + fm["argument-hint"] : "";
        out.push(
          (fm.name || dir) + "\n  " + (fm.description || "(no description)") + hint
        );
      }
      return out.join("\n\n");
    },
  },
  {
    name: "read_skill",
    description: "Read one skill's full SKILL.md, by the name returned from list_skills.",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string", description: "Skill folder name." } },
      required: ["name"],
      additionalProperties: false,
    },
    run(args) {
      const abs = safeResolve(path.join("skills", args.name, "SKILL.md"));
      if (!abs.startsWith(SKILLS_DIR + path.sep)) {
        throw new Error("read_skill only reads paths under skills/");
      }
      return readText(abs);
    },
  },
  {
    name: "read_reference",
    description:
      "Read a long-form reference doc that backs the distilled fragments — A11Y.md (WCAG 2.2 AA, with anti-patterns and fixes) or INCLUSION.md. Call with no name to list what is available.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Reference file name, e.g. 'A11Y.md'. Omit to list." },
      },
      additionalProperties: false,
    },
    run(args) {
      const available = listMarkdown(REFERENCES_DIR);
      if (!args.name) {
        return "Available references:\n" + available.map((n) => "  " + n).join("\n");
      }
      const name = args.name.endsWith(".md") ? args.name : args.name + ".md";
      if (!available.includes(name)) {
        throw new Error("no such reference: " + name + ". Available: " + available.join(", "));
      }
      return readText(path.join(REFERENCES_DIR, name));
    },
  },
  {
    name: "build_instructions",
    description:
      "Render the combined instruction file (shared fragments, then one pack's fragments) as scripts/build-instructions.sh would emit it — without writing anything. Use to preview what a repo's CLAUDE.md / AGENTS.md would say before generating it.",
    inputSchema: {
      type: "object",
      properties: {
        pack: {
          type: "string",
          description:
            "Optional pack name from list_packs to append. Omit for the shared fragments only.",
        },
      },
      additionalProperties: false,
    },
    run(args) {
      const parts = [GENERATED_HEADER, ""];
      for (const name of listMarkdown(FRAGMENTS_DIR)) {
        parts.push(readText(path.join(FRAGMENTS_DIR, name)));
      }
      if (args.pack) {
        const packDir = safeResolve(path.join("fragments", "packs", args.pack));
        if (!packDir.startsWith(PACKS_DIR + path.sep) || !fs.existsSync(packDir)) {
          throw new Error("no such pack: " + args.pack);
        }
        for (const name of listMarkdown(packDir)) {
          if (name === "README.md") continue;
          parts.push(readText(path.join(packDir, name)));
        }
      }
      // Trailing "" reproduces the blank line the shell script's per-fragment
      // `printf '\n'` leaves after the last fragment.
      parts.push("");
      return parts.join("\n");
    },
  },
];

const TOOLS_BY_NAME = new Map(TOOLS.map((t) => [t.name, t]));

// --- JSON-RPC plumbing ------------------------------------------------------

function send(message) {
  process.stdout.write(JSON.stringify(message) + "\n");
}

function reply(id, result) {
  send({ jsonrpc: "2.0", id: id, result: result });
}

function replyError(id, code, message) {
  send({ jsonrpc: "2.0", id: id, error: { code: code, message: message } });
}

function handle(message) {
  const id = message.id;
  const method = message.method;
  const params = message.params;
  const isNotification = id === undefined || id === null;

  switch (method) {
    case "initialize": {
      const requested =
        params && typeof params.protocolVersion === "string"
          ? params.protocolVersion
          : DEFAULT_PROTOCOL;
      return reply(id, {
        protocolVersion: requested,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
      });
    }
    case "notifications/initialized":
    case "notifications/cancelled":
      return; // nothing to acknowledge
    case "ping":
      return reply(id, {});
    case "tools/list":
      return reply(id, {
        tools: TOOLS.map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
        })),
      });
    case "tools/call": {
      const name = params && params.name;
      const tool = TOOLS_BY_NAME.get(name);
      if (!tool) return replyError(id, -32602, "unknown tool: " + name);
      try {
        const text = tool.run((params && params.arguments) || {});
        return reply(id, { content: [{ type: "text", text: text }] });
      } catch (err) {
        // Tool failures come back as a result with isError, not a protocol
        // error, so the model can read the message and fix its arguments.
        return reply(id, {
          content: [{ type: "text", text: "Error: " + err.message }],
          isError: true,
        });
      }
    }
    // Advertised in neither capabilities nor use, but some clients probe them
    // on connect; an empty list is friendlier than a protocol error.
    case "resources/list":
      return reply(id, { resources: [] });
    case "prompts/list":
      return reply(id, { prompts: [] });
    default:
      if (isNotification) return;
      return replyError(id, -32601, "method not found: " + method);
  }
}

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let newline;
  while ((newline = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, newline).trim();
    buffer = buffer.slice(newline + 1);
    if (!line) continue;
    let message;
    try {
      message = JSON.parse(line);
    } catch {
      replyError(null, -32700, "parse error");
      continue;
    }
    try {
      handle(message);
    } catch (err) {
      if (message.id !== undefined && message.id !== null) {
        replyError(message.id, -32603, err.message);
      }
    }
  }
});
process.stdin.on("end", () => process.exit(0));
