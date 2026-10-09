# Automation Strategy

## Locator strategy
1. `data-qa-id` is preferred when present.
2. Accessible role/name is the next choice for user-facing controls.
3. Stable URL/path or semantic attributes are preferred over CSS classes and generated DOM indexes.
4. Avoid XPath tied to layout or generated class names.
5. When `data-qa-id` is absent, document the fallback locator and why it is stable.

## Desktop/mobile
The same functional suite is executed against desktop Chromium and iPhone 13 emulation. Device-specific navigation differences are handled in page objects rather than duplicating business assertions.

## Isolation
- Each test gets a fresh Playwright BrowserContext by default.
- No test depends on another test's ordering.
- Authenticated state, when required, should be created through a dedicated setup fixture and stored as isolated `storageState` per test worker/account.
- Do not reuse a mutable account concurrently.

## Parallelism
Public read-only tests are safe to run in parallel. Stateful tests (like/unlike, comments, profile changes) should use dedicated accounts or be serial within an isolated account fixture.

## Timeouts/retries
- Test timeout: 30s.
- Assertion timeout: 7s.
- Navigation timeout: 20s.
- CI retries: 2; local retries: 0 to expose flaky behavior immediately.
- Retries are not a substitute for fixing synchronization.

## Flaky test handling
- Wait for meaningful UI state/network response where appropriate.
- Avoid arbitrary `waitForTimeout`.
- Capture trace/video/screenshot on failure.
- Quarantine only after evidence of an environment/product issue, with an owner and follow-up ticket.
- Re-run failed tests independently to distinguish product failure from test flakiness.

## Data cleanup
Prefer read-only scenarios. For stateful scenarios, use unique test data and delete/reset through an API or UI cleanup step where supported. Never use production-like personal accounts for automated mutation tests.
