<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# Oguz-Nyzam
Dean Control

## Localization
This project now includes localization support for English (en), Russian (ru), and Turkmen (tk).

Backend (ASP.NET Core):
- Resources are under Resources/SharedResource.resx and culture-specific files (.ru.resx, .tk.resx).
- Request localization is configured in Program.cs. API controllers use IStringLocalizer<SharedResource> for localized messages.

Frontend (React):
- i18next + react-i18next were added. Initialization is in src/i18n.js.
- Locale JSON files: src/locales/en.json, src/locales/ru.json, src/locales/tk.json.
- A language selector is added to the NavBar component.

To change the frontend language at runtime use the selector in the top-right of the app. To change the API default culture, edit Program.cs where supported cultures are configured.
>>>>>>> c8812d265fdb9c2b3478c1e1758c761c2e786187
