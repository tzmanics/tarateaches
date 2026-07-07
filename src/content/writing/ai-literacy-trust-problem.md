---
title: "AI literacy is a trust problem, not a tooling problem"
date: 2026-06-15
excerpt: "Most AI training teaches people where the buttons are. The actual skill is knowing when to trust the output — and that's a curriculum problem."
tags: ["AI Education"]
meta: "New · AI Education"
---

<!-- DRAFT: edit into your own words. This one answers the interview question: "How would you approach AI education for a broad audience?" -->

Most AI training I've seen teaches people where the buttons are. Here's the prompt box. Here's how to upload a file. Here's a template for a marketing email.

Then those same people ship a hallucinated statistic to their boss, get burned once, and quietly stop using the tools altogether. Or the opposite: they never get burned, so they trust everything, and eventually ship something worse.

Neither group has a tooling problem. Both have a calibration problem.

## The skill nobody's teaching

The core competency of working with AI isn't prompting. It's **calibrated trust**: knowing, for a given task, how likely the output is to be right, how expensive it is to be wrong, and how you'd check.

That's three separate judgments, and they're learnable:

- **Failure modes by task type.** Models are strong at transformation (summarize, translate, reformat) and shakier at retrieval (exact quotes, citations, current facts). A learner who knows *which kind of task they just asked for* can predict their own risk.
- **Cost of being wrong.** A brainstorm that's 70% good is a win. A legal citation that's 99% good is a liability. Same tool, opposite stakes.
- **Verification as a habit, not a vibe.** Teach concrete checks: click the citation, run the code, ask for the source, ask the model to argue against itself.

## What this means for curriculum

If trust calibration is the skill, curriculum design changes:

1. **Lead with failure, kindly.** The most valuable lab exercise I know is having learners *induce* a confident wrong answer, then catch it. One supervised burn beats ten warnings on a slide.
2. **Teach task taxonomy before tool features.** "What kind of ask is this?" transfers across every tool and model release. Button locations don't.
3. **Assess judgment, not recall.** Don't quiz "what is a hallucination." Hand them an output and ask: what here would you verify first, and how?

## The stakes

People who under-trust AI lose the productivity. People who over-trust it lose credibility — sometimes their organization's. The whole game of AI literacy is moving people into the narrow, useful middle, and that's not a feature tour. That's education. It's the kind I want to build.
