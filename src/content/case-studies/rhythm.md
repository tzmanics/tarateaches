---
title: "Rhythm"
org: "Independent"
dek: "An adaptive household schedule that never needs rescheduling. Tomorrow isn't moved, it's computed."
order: 6
theme: "ink"
facts:
  - "Runs a real household day — kid anchors, meals, chores on every cycle from daily to yearly, and a marathon training plan — on two data types and one pure function."
  - "Nothing is stored per-day, so misses are absorbed instead of rescheduled; the training plan rebuilds itself from the last completed run."
  - "Ask your schedule questions in plain language — Claude answers straight off the completion log."
image: ./images/rhythm.png
imagePosition: "2% 10%"
url: "https://rhythmtodo.netlify.app"
---

<!-- DRAFT: edit into your own words and add the details only you know. -->

## The situation

Every scheduling app fails the same way: life happens, tasks pile up, and suddenly you're spending Sunday night dragging overdue chores around a calendar. The app punishes you for being human, and then you stop using the app.

Rhythm is my answer: a household schedule where nothing ever needs rescheduling, because nothing is stored per-day. Goals are rules, completions are a log, and every day on screen is computed fresh from those two things. Miss something? Tomorrow already absorbed it.

## What I actually did

- Reduced the whole system to `computeDay(goals, completions, date)` — one pure function over two data types. Everything on screen is derived, every time.
- Built two recurrence semantics on purpose: calendar rules that keep rhythm (groceries done late Monday is still due next Sunday) and interval rules that drift with you (water the plants seven days from when you *actually* watered).
- Made the marathon training plan regenerate — miss a run and the remaining plan rebuilds from your last completed distance to race day. No guilt stacking, no manual replanning.
- Added the humane parts: vacation mode that pauses goals until a date, per-day chore-load totals so you see an overloaded Thursday coming, and an Ask box where Claude answers "when did I last clean the fridge?" straight off the completion log.

## What it took

Holding the line on derived state. Because due-ness is computed rather than stored, there are no rollover jobs, no task-moving logic, and no state to corrupt — undo is deleting a row. That bet is also why the core logic is 22 fast tests with zero mocks, and why swapping the training philosophy or the backend is one small function away.

## What came out of it

An installable PWA my household actually runs on — and a design conviction: the best way to handle missed tasks is to build a system where "missed" isn't a state that needs handling at all.
