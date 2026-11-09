# Security policy

PSEdit is a set of instruction files for Claude Code plus one optional hook script, `skills/psedit/hooks/psedit-prompt.mjs`. The hook runs on every prompt you send, so anything that makes it do more than described below is a security issue.

## What the hook promises

- **No network.** It never fetches or sends anything.
- **No writes.** It reads your prompt from stdin and, if present, the nearest `.claude/psedit.json`. It writes nothing to disk.
- **No blocking.** On any error it exits quietly with code 0, so your prompt is never stopped.
- **Fixed output.** The only thing it adds to Claude's context is a fixed hint that names the matched keyword. It never echoes the rest of your prompt or the contents of the config file.

## Reporting a vulnerability

Please **do not open a public issue** for a vulnerability.

Use GitHub's private reporting instead: **Security → Report a vulnerability** on this repository. Include what happens, the input (prompt and `.claude/psedit.json`) that triggers it, and your OS and Node.js version.

This is a personal project, so replies may take a few days.

## Out of scope

- What Claude writes when following the skill (wrong facts, style you dislike). Please open a regular issue for these.
- Rules you added yourself to `~/.claude/psedit/taste.md` or to your global `CLAUDE.md`.
