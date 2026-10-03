# Plus-One — AI Household Orchestrator for Swiggy

> **Swiggy Builders Club Submission** — Multi-agent AI assistant that plans complete occasions (anniversary dinners, parents' visits, client dinners) by coordinating Swiggy Food, Instamart, and Dineout in parallel.

---

## What It Does

You type: *"Plan our anniversary dinner this Saturday, budget ₹6000"*

Plus-One runs three AI agents simultaneously:

| Agent | What it does |
|-------|-------------|
| **Food Agent** | Finds 3 restaurants matching your cuisine preferences, dietary constraints, and budget via Swiggy Food |
| **Instamart Agent** | Sources cake + flowers with timed deliveries (flowers arrive before you leave, cake arrives after starters) |
| **Dineout Agent** | Checks table availability, stacks GIRF + card + DineCash offers in the correct order, generates deeplink |

The Orchestrator merges all three results into a single occasion plan with a timeline, cost breakdown, and one-tap confirm flow.

---

## Architecture

```
User Message
     │
     ▼
Orchestrator (src/lib/agents/orchestrator.ts)
     │
     ├─── Food Agent ──────► Swiggy Food MCP (or LLM simulation)
     ├─── Instamart Agent ──► Swiggy Instamart MCP (or LLM simulation)
     └─── Dineout Agent ───► Swiggy Dineout MCP (or LLM simulation)
           │
           ▼
     Conflict Resolution → Timeline Build → Plan Assembly
           │
           ▼
     LLM: Generate warm summary message
           │
           ▼
     Chat UI
```

**Key invariants enforced in code:**
- `INV-1`: All 3 agents run via `Promise.all` — never sequential
- `INV-2`: `book_table` / order placement only after explicit user "confirm" (TypeScript literal type gate)
- `INV-3`: Household allergies propagated to every agent call
- `INV-6`: Offer stacking always GIRF → card → DineCash (no deviation)
