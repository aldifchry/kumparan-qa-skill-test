# Kumparan QA Test Cases & Risk Analysis

## Assumptions
- Public web testing is performed against `https://kumparan.com`.
- A stable article URL is supplied through `KUMPARAN_ARTICLE_URL` because homepage content is dynamic.
- Authenticated testing requires a dedicated test account from Kumparan; credentials are stored only in local `.env`/CI secrets.
- No real comment or report is submitted, per brief.
- External social-share destinations are out of scope; we validate the share control/prompt only.

## Dependencies / Data
- Browser: Chromium desktop + iPhone 13 emulation.
- Active test account + intentionally invalid credential set, if the supported authentication flow permits it.
- Stable article URL with like/comment/share/report controls.
- Internet access and third-party auth availability.

## Exit Criteria
- All P0/P1 cases executed.
- No open P0 defects; P1 defects documented with agreed disposition.
- Desktop and mobile core journeys pass.
- Automation is reproducible twice consecutively in a clean environment.

| ID | Area | Scenario | Type | Priority | Expected Result |
|---|---|---|---|---|---|
| WEB-001 | Home | Open homepage | Happy path | P0 | Page loads, title/nav/search visible |
| WEB-002 | Search | Search valid keyword | Happy path/data validation | P1 | Results page reflects keyword |
| WEB-003 | Story | Open article and render body | Happy path | P0 | Story content renders correctly |
| WEB-004 | Auth | Like while logged out | Authorization/state | P0 | User is prompted to authenticate; like is not persisted |
| WEB-005 | Story | Share control | Happy path | P1 | Share UI is available without broken layout |
| WEB-006 | Story | Report control | Negative/safety | P1 | Report UI can be opened; no report submitted |
| WEB-007 | Comment | Comment while logged out | Authorization | P0 | Authentication is required |
| WEB-008 | Auth | Valid account login | Happy path | P0 | User becomes authenticated |
| WEB-009 | Auth | Invalid account | Negative/error handling | P0 | Login rejected with clear error; no authenticated state |
| WEB-010 | Auth | Logout after login | State change | P0 | Session is cleared and protected actions require login |
| WEB-011 | Search | Empty search | Boundary | P2 | No crash; sensible UX/validation |
| WEB-012 | Search | Long keyword / special chars | Boundary/negative | P2 | No crash/XSS-like rendering; controlled result |
| WEB-013 | Story | Refresh after like | State change | P1 | Like state/count remains consistent |
| WEB-014 | Story | Browser back/forward after article | State/navigation | P2 | Correct page/state restored |
| WEB-015 | Responsive | Desktop article | Responsive | P0 | No clipping/overlap; core controls usable |
| WEB-016 | Responsive | Mobile article | Responsive | P0 | Core controls remain reachable and usable |
| WEB-017 | Responsive | Mobile navigation | Responsive | P0 | Navigation/search remain accessible |
| WEB-018 | Error | Offline/failed navigation | Error handling | P1 | Graceful error, no infinite broken state |
| WEB-019 | Data | Article title/body consistency | Data validation | P1 | Visible content matches loaded article |
| WEB-020 | Exploratory | Rapid repeated navigation/search | Exploratory | P2 | No crashes, duplicate overlays, or stuck loaders |

## Risk Matrix

| Risk | Likelihood | Impact | Priority | Mitigation |
|---|---|---|---|---|
| Authentication flow depends on Google/Facebook | High | High | P0 | Obtain dedicated test auth flow/credentials; otherwise mark blocked |
| Dynamic homepage content changes | High | Medium | P1 | Use stable article URL and semantic/test-id locators |
| Mobile layout differs from desktop | Medium | High | P0 | Run same business assertions on mobile project |
| Third-party share/auth dependency | Medium | Medium | P1 | Assert integration entry point only; isolate external systems |
| Flaky async content | Medium | High | P1 | Wait for observable UI state, not fixed sleeps; trace on failure |
| Test data contamination | Medium | High | P1 | Read-only/public tests; dedicated account for stateful tests |

## Execution Record

Populate this section after local execution. Do not claim a pass/fail before running the suite.

| Environment | Result | Evidence |
|---|---|---|
| Desktop Chromium | Not Executed | `npx playwright test --project=desktop` |
| Mobile iPhone 13 | Not Executed | `npx playwright test --project=mobile` |
| GraphQL API | Not Executed | `npx playwright test --project=api` |
