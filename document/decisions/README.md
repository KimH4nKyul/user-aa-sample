# Decisions (ADR) Guide

This directory contains Architecture Decision Records (ADR).

## Required Reading Order (IMPORTANT)

When working with decisions, ALWAYS read files in this order:

1. adr-index.md
2. template.md
3. relevant adr-*.md files

## How to Use

- adr-index.md:
    - Provides a list of all decisions
    - Use it to understand overall architecture direction

- template.md:
    - Defines the required ADR structure
    - ALL new ADRs MUST follow this format

## Rules (MANDATORY)

- MUST:
    - Follow template.md exactly when creating a new ADR
    - Keep sections and headings unchanged
    - Write in structured bullet format (not long paragraphs)

- MUST NOT:
    - Skip sections from template.md
    - Change section names
    - Write unstructured prose

- SHOULD:
    - Keep each ADR focused on a single decision
    - Link related ADRs in "Related" section

## When Creating a New ADR

1. Read adr-index.md
2. Check if similar decision already exists
3. Copy template.md
4. Fill all sections
5. Add new entry to adr-index.md

## When Generating Code or Design

- ALWAYS align with existing ADRs
- If conflict occurs:
    - Follow the latest ADR
    - Or explicitly ask for clarification

## Output Requirement (IMPORTANT)

When asked to create an ADR:
- Output MUST follow template.md exactly
- Do NOT omit sections