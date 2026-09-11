**Great — you’re ready to create a VS Code Agent Plugin.**  
Here’s a complete, practical, *developer‑friendly* guide to building one from scratch so you can package and share your skills, MCP servers, custom agents, and other AI harness components.

---

## 🚀 Core Idea  
An **Agent Plugin** is a portable folder that bundles:  
- Skills (`skills/`)  
- MCP servers (`mcp.json`)  
- Custom agents (`com.github.copilot/agents/`)  
- Hooks (`com.github.copilot/hooks/`)  
- Slash commands  
- Any supporting scripts  

Once packaged, anyone can install your plugin in VS Code, GitHub Copilot, or other compatible agent clients.

This is the best way to share your AI harness across your freelance work, your yoga app, or your storytelling brand.

---

## 🧩 1. Plugin Folder Structure (the standard)

Create a folder like:

```
my-awesome-plugin/
  plugin.json
  skills/
    my-skill/
      SKILL.md
      run.sh
  mcp.json
  com.github.copilot/
    agents/
      reviewer.agent.md
    hooks/
      hooks.json
  scripts/
    helper.js
```

Let’s break down each part.

---

## 📄 2. `plugin.json` — the plugin manifest  
This file declares your plugin’s identity and what it contains.

Example:

```json
{
  "name": "my-awesome-plugin",
  "version": "1.0.0",
  "description": "Tre's shared AI harness: skills, agents, MCP tools",
  "publisher": "tre",
  "categories": ["skills", "agents", "mcp"]
}
```

---

## 🧠 3. Adding Skills (`skills/`)  
A **skill** is a reusable capability the agent can call.

Each skill lives in its own folder:

```
skills/my-skill/SKILL.md
skills/my-skill/run.sh
```

### `SKILL.md` defines the behavior:

```markdown
# My Skill
Runs a custom script to analyze code quality.

## Inputs
- `path`: file or folder to analyze

## Outputs
- JSON report

## Run
```bash
./run.sh {{path}}
```
```

### `run.sh` executes the logic:

```bash
#!/bin/bash
echo "Analyzing $1..."
# your logic here
```

VS Code will automatically expose this skill in **Configure Skills**.

---

## 🔌 4. Adding MCP Servers (`mcp.json`)  
MCP servers let your agent call external APIs, databases, or tools.

Example:

```json
{
  "servers": [
    {
      "id": "uvuYogaScheduler",
      "command": "node",
      "args": ["./scripts/scheduler-mcp.js"]
    }
  ]
}
```

This is perfect for your yoga app’s scheduling, payments, or social graph features.

---

## 🧑‍🚀 5. Custom Agents (`com.github.copilot/agents/`)  
A custom agent is a persona with its own instructions and tool permissions.

Example:

```
com.github.copilot/agents/reviewer.agent.md
```

```markdown
# Reviewer Agent
You are a strict but constructive code reviewer.
Focus on readability, accessibility, and maintainability.

Tools allowed:
- my-skill
- uvuYogaScheduler
```

This agent will appear in VS Code’s agent selector.

---

## 🔁 6. Hooks (`com.github.copilot/hooks/hooks.json`)  
Hooks let you run scripts at lifecycle events.

Example:

```json
{
  "preRun": ["scripts/pre-run.js"],
  "postRun": ["scripts/post-run.js"]
}
```

Use this to enforce formatting, logging, or environment checks.

---

## 💬 7. Slash Commands  
Add commands like `/analyze`, `/review`, `/schedule`.

These are defined inside your agent or skill metadata.

---

## 📦 8. Packaging & Sharing  
Your plugin is just a folder. You can share it by:

- Publishing to **Awesome Copilot** marketplace  
- Sharing via GitHub repo  
- Packaging as a `.zip`  
- Using VS Code’s `chat.plugins.enabled` setting to load it locally  

Teams can install it once and instantly get all your skills + agents.

---

## 🛠 9. Development Workflow  
1. Create the folder structure  
2. Add `plugin.json`  
3. Add skills  
4. Add MCP servers  
5. Add custom agents  
6. Add hooks  
7. Test in VS Code  
8. Publish or share  
