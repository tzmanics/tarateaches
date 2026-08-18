---
title: "Teaching through change: docs, courses & chaos"
date: 2026-03-18
excerpt: "Every educator's nightmare: the product shipped, and your curriculum is now historical fiction. How to build education that survives its subject."
tags: ["Education"]
meta: "New · Education"
draft: true
---

<!-- DRAFT: edit into your own words. Answers: "How would you keep education current while the product changes weekly?" — very relevant to any AI company. -->

Every technical educator knows the nightmare: the product team ships something great on Tuesday, and by Wednesday your course is historical fiction. Screenshots of a UI that no longer exists. A "best practice" the docs now warn against. A confident video of you demonstrating a button that has been renamed, moved, and deprecated.

At Netlify I taught on top of a platform that shipped constantly, in an ecosystem (hello, JavaScript frameworks) that reinvented itself roughly quarterly. Here's what kept the education standing.

## Separate the load-bearing from the decorative

Every curriculum has two kinds of content:

- **Load-bearing concepts** — mental models that survive releases. What a build is. Why deploys should be atomic. How to think about caching. These change on a scale of years.
- **Decorative specifics** — button names, flag syntax, screenshots, version numbers. These change on a scale of weeks.

The design move is structural: keep the specifics *quarantined* in places that are cheap to update — code snippets, callouts, companion repos — and never let them soak into the conceptual narration. A video that says "click the deploy settings" ages fine. A video that spends four minutes touring the deploy settings screen is a countdown timer.

## Build a decay schedule, not a rescue mission

Content doesn't announce when it breaks; learners just quietly bounce off it. So don't wait for the fire:

1. **Date everything, visibly.** Learners forgive age they can see. They don't forgive being silently misled.
2. **Review on a calendar, not a complaint.** Each piece of content gets a freshness interval based on how volatile its subject is. High-churn topics get short leashes.
3. **Make updating cheaper than rewriting.** Templates, shared snippets, and a single source of truth for anything referenced more than once. The certification content at Netlify survived because a change usually meant editing one file, not re-shooting a video.

## Chaos is the curriculum

Here's the reframe that changed how I teach: in a fast-moving field, *coping with change is a learning objective*. Teach people how to read a changelog, how to check which version they're on, how to debug when the tutorial and reality disagree. A learner who can survive drift is better educated than one who memorized a snapshot.

Which is, not coincidentally, exactly the posture AI education needs right now. The models will change. Teach for that.
