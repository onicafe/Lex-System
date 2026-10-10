# Lex System UX & Interaction Guidelines (SOP)

**Version:** 0.0.1
**Classification:** Internal Architecture / B.L.A.S.T Protocol Document

## 1. Interface Philosophy

The Lex System interface must exude trust, professionalism, and high-performance clarity. It serves dual purposes: empowering lawyers to work 10x faster and providing peace of mind to their clients.
*   **Mobile-First Strictness:** 1. Mobile (Touch priorities) -> 2. Tablet -> 3. Desktop. 
*   **App-Like Feel:** Provide bottom navigation bars on mobile and support Progressive Web App (PWA) installation.

## 2. Loading & Processing States

*   **Rule:** Never use blocking, full-screen spinners for localized data fetching.
*   **Implementation:** 
    *   Use **Skeleton Loaders** mirroring the exact shape of the incoming data to eliminate Cumulative Layout Shift (CLS).
    *   For heavy asynchronous actions (e.g., "AI Drafting Document..."), present a localized, non-blocking toast or a distinct `.loading` cursor overlay on the interactive element.

## 3. Interaction Modals (Polymorphism)

*   **Rule:** *Never* utilize native browser `alert()`, `confirm()`, or `prompt()` dialogs.
*   **Implementation:** Build a centralized Context-Aware Modal Manager (`CustomModalSystem`).
    *   **Info Modals:** Clean, dismissible context.
    *   **Confirmation Modals:** Requires explicit intent. For destructive actions (e.g., "Delete Case"), require typing the case number or holding down the confirmation button to prevent accidental clicks.

## 4. Haptic Feedback Integration

To create an app-like UX in the browser, integrate `web-haptics` across mobile devices.
*   **Implementation Matrix:**
    *   **Standard Tap/Click (`.pointer`):** Very small, subtle vibration ("tick" feedback).
    *   **Successful Form Submission or Completion:** Medium, double pulsation ("happy" vibration).
    *   **Confirmation Action:** Strong, single burst vibration.
    *   **Deny, Invalid Input, Error:** Strong, fast double shake accompanied by a subtle red flash on the input border.

## 5. Explicit Cursor Behaviors

Design UI components to explicitly broadcast interactability via cursors:
*   `.pointer`: Links, buttons, selectable table rows.
*   `.text-input`: Form inputs, search boxes, rich-text document editors.
*   `.grab` / `.grabbing`: Drag-and-drop elements (Kanban stages, document reordering).
*   `.help`: Hovering over complex legal terminology or tooltip icons.
*   `.not-allowed`: Disabled buttons with clear visual dimming.

## 6. Accessibility (A11y) & WCAG Compliance

*   **Keyboard Navigation:** Entire application must be navigable via `Tab` and `Shift+Tab`. Active focus states must be heavily visible (high contrast outlines).
*   **Color Contrast:** Ensure a minimum 4.5:1 contrast ratio between text and backgrounds in both Light mode and the "Legal Dark Mode".
*   **ARIA Attributes:** Implement dynamic aria-live regions for AI agent replies and dynamically updating schedules.
