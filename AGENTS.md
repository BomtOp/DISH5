# Plus-One — Swiggy Household Orchestrator Instructions

## Project

Plus-One: multi-agent AI household orchestrator for Swiggy (Food + Instamart + Dineout).

## Critical Invariants

- **INV-1**: Orchestrator MUST use `Promise.all([runFoodAgent, runInstamartAgent, runDineoutAgent])`
- **INV-2**: `book_table` and all order placements require explicit user confirmation — never execute without it
- **INV-3**: Household allergy constraints propagated to ALL agents
- **INV-6**: Offer stacking order: GIRF → card → DineCash (no exceptions)

## Hard Constraints

- NEVER execute `book_table` or place orders without explicit user "yes/confirm"
- NEVER hallucinate MCP data — only use what agents return
- NEVER ignore household allergy constraints — allergies are hard blockers
- NEVER run Food/Instamart/Dineout agents sequentially — always parallel

## Swiggy Brand Tokens

Primary: `#FC8019` (orange) | Dark: `#282C3F` | Green: `#60B246` | Red: `#E23744`
Font: Inter | Base radius: 10px (cards), 9999px (pills)
