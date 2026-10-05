# eGovPH - HCI2 Prototype

This is an academic prototype of the eGovPH super app for Human-Computer Interaction usability testing. It simulates transactional behaviors (registration, verification, document management, claims) using a local persistence mock (`localStorage` and `IndexedDB`) so it can be deployed as a static site without backend infrastructure.

## Setup

```bash
npm install
npm run dev
```

## Running Tests

Automated tests rely on Vitest (Unit) and Playwright (E2E).

```bash
# Unit tests
npm run test

# End-to-end browser tests
npx playwright test
```

*Note: You may need to run `npx playwright install` first.*

## Key Features
* **Mock Local Database:** All user data, transactions, and preferences are saved locally. Reset this via `Settings -> Research Tools`.
* **Attachment Persistence:** File uploads (Start-Up Pitch Decks, PhilHealth Claims, PDS Documents) are stored efficiently as Blob objects via `IndexedDB`.
* **Adaptive Workflows:** The app handles session validation, simulated OTP challenges (demo codes: `123456`, `000000`), and real-time state changes seamlessly without reloading.
* **Component-Driven:** Built using React functional components, standardized UI elements, and a centralized theming/routing configuration.

*This project is not affiliated with the official Philippine Government.*
