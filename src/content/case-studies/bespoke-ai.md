---
title: "Bespoke AI"
org: "Independent"
dek: "An adaptive AI-literacy tutor — one tutor, one model, transferable concepts, meeting learners exactly where they are."
order: 4
theme: "paper"
facts:
  - "A compact learner profile — proficiency, learning style, tutor notes — drives elastic module depth: pass first-try and the content condenses."
  - "Modules only count as complete after a mandatory validation step: learners must articulate how they'd fact-check the AI's output."
  - "The whole product talks to a model-agnostic TutorEngine seam — the vendor name appears in exactly one file."
---

<!-- DRAFT: edit into your own words and add the details only you know. -->

## The situation

AI literacy education has an overwhelm problem: a true beginner gets hit with a dozen tools, a dozen models, and advice that expires in a quarter. What beginners actually need is one tutor, one underlying model, and transferable concepts that survive the next release cycle.

Bespoke AI (BAI) is a proof-of-concept for that: an adaptive tutor that builds a picture of each learner and reshapes the curriculum around them.

## What I actually did

- Designed a learner profile that's deliberately compact — per-topic proficiency, a doer/understander learning-style flag, and a bounded notes field. That small profile, not a transcript, is what the tutor loads each session.
- Made the modules elastic: the same content renders condensed, standard, or expanded depending on demonstrated proficiency. Pass an exercise first-try and the module condenses; struggle and the tutor *offers* — never forces — a detour to the relevant foundational module, with a pointer back to where you left off.
- Built assessment as a conversation, optional and skippable at every step, with a light diagnostic because self-reports are ambiguous.
- Made validation mandatory: the fully-built Prompting Basics module doesn't count as complete until the learner articulates how they'd fact-check the AI's output. Trust-but-verify is the curriculum, not a footnote.

## What it took

Drawing the AI seam in the right place. Everything talks to a `TutorEngine` interface; v1 ships a fully mocked tutor that's genuinely interactive — exercises really pass and fail, struggle really triggers the detour — with zero API calls. The production engine is a documented placeholder, and the vendor name appears in exactly one file, because the product identity stays model-agnostic even when the implementation isn't.

## What came out of it

A working skeleton that demonstrates the pedagogy I keep coming back to: adapt the depth, not the standards. Learners move at different speeds through the same honest material — and the system that teaches people to verify AI output holds itself to the same rule.
