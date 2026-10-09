# Kumparan QA Engineer Skill Test

This repository contains the proposed submission for the Kumparan QA Engineer take-home assignment.

## Scope
- Requirements analysis and risk-based test cases
- Desktop + mobile Playwright website automation
- Playwright Agent exploration prompt
- GraphQL API automation using Playwright `APIRequestContext`

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

Update `.env` if Kumparan provides a stable article URL or dedicated test credentials.

## Run

```bash
npm test
npm run test:desktop
npm run test:mobile
npm run test:api
npm run report
```

## Important execution note
The repository intentionally does **not** contain fabricated execution results. Run the suite locally and update `docs/test-cases.md` with the real results/evidence.

The current public Kumparan login flow may rely on Google/Facebook. If the assignment requires an active/invalid credential test, obtain a dedicated test account or test login mechanism from the recruiter/product team rather than automating against a personal account.

## GraphQL
GraphQLZero is used as the practice endpoint. It is a fake GraphQL API intended for testing/prototyping and provides entities such as users, posts, comments, todos, albums and photos.
