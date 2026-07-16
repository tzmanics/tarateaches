---
title: "witchai.dev"
org: "Independent"
dek: "A task-to-model router — type what you're trying to do, get the smartest, cheapest, most energy-light AI model for that exact job."
order: 5
theme: "red"
facts:
  - "One input → a ranked short-list of model + provider picks, scored on cost, skill, and energy, weighted by the user's drag-and-drop priorities."
  - "Live OpenRouter pricing and Artificial Analysis benchmark data, refreshed on a schedule and cached in Netlify Blobs."
  - "One static HTML file, vanilla JS, zero framework, zero build step — the tool practices the lightness it preaches."
---

<!-- DRAFT: edit into your own words and add the details only you know. -->

## The situation

Most people reach for the biggest model for every task — a sledgehammer for a thumbtack. One 2025 study estimated that right-sizing model selection alone could cut global AI energy use by roughly 28%. That's an abstraction, though, and abstractions don't change behavior.

witchai.dev makes it personal and immediate: you type a task, and the app tells you which AI model and provider is the smartest, cheapest, and most energy-light choice for *that specific task* — pulled from live pricing and benchmark data, not a static table someone forgot to update.

## What I actually did

- Designed a scoring system that ranks every eligible model on cost, skill-fit, and energy — weighted by the user dragging Cost / Skill / Energy into their own priority order. No sliders, no jargon.
- Built the data layer on live sources: OpenRouter's public pricing endpoint and Artificial Analysis benchmarks, refreshed hourly by Netlify Scheduled Functions and cached in Netlify Blobs, with a last-known-good fallback so a flaky upstream never breaks a recommendation.
- Kept classification cheap on purpose: rules first, and only when rules can't confidently match does the app call the single cheapest available model to classify — never anything larger.
- Gave it a voice. The whole thing wears a sophisticated witch/apothecary aesthetic — consulting the right spell for the task — and tasks that don't need AI at all ("walk my dog") get a dry human answer instead of a model recommendation.

## What it took

The discipline to let the constraint shape the build. An app about light-footprint AI can't ship a heavy frontend, so it doesn't: one static HTML file, vanilla JS, native drag-and-drop, no framework runtime, no build step. And honesty about data limits — energy shows as a Low/Medium/High badge with a documented methodology, never a precise-looking number the underlying research can't support.

## What came out of it

A working demonstration that "use the right-sized model" can be a tool instead of a lecture — and a teaching artifact: the README explains the scoring methodology in plain language, because the point isn't just routing tasks, it's building the instinct.
