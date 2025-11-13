# WebMCP Trading Dashboard Sandbox

A React + Tailwind research experience that doubles as a **sandbox for testing the Model Context Protocol (MCP) through the WebMCP (MCP‑B) VS Code extension**. The app simulates an equity research workspace with realistic content, interactive market widgets, annotations, and a robust set of `server.tool` integrations you can invoke from WebMCP while the page is running.

![Trading Dashboard Screenshot](https://raw.githubusercontent.com/brianscott1980-cyber/webmcp/master/public/logo512.png)

## Why this sandbox exists

WebMCP lets you call `server.tool` functions—just like native MCP clients—directly inside the browser preview that the extension manages. This project provides:

- A rich UI surface (article reader, market dashboards, overlays) to observe tool side-effects.
- A wide catalog of MCP tools (navigation, theming, content injection, gallery control, etc.).
- A safe environment for experimenting with request/response payloads before wiring real data providers.

Use it to prototype new MCP tools, validate prompt flows, or demo capabilities to teammates without touching production systems.

## Highlights

- **Market intelligence workspace** – Summaries, watchlists, market performance charts, and a full AI market analysis article with side panels.
- **Reader productivity toolkit** – Snippet capture, annotations, sticky article actions, related research recommendations, and company modal previews.
- **Interactive visual assets** – Embedded charts open in a high-resolution gallery overlay that supports mouse, keyboard, and MCP-triggered navigation.
- **MCP tool coverage** – Dozens of tools exercise DOM manipulation, theme control, data refresh, and navigation flows so you can see live feedback when calling them via WebMCP.

## WebMCP sandbox testing

1. Install the **MCP-B (WebMCP)** VS Code extension.
2. Start the development server (`npm start`) and open the preview in WebMCP.
3. Use the extension’s command palette or side panel to invoke tools exposed by the in-page `McpServer`.
4. Observe the dashboard update in real time—tweak inputs, retry commands, and iterate on new tools quickly.

### Notable `server.tool` commands

| Tool | What it does |
| --- | --- |
| `toggleDayNightMode`, `setNightMode`, `setDayMode` | Switches the reading theme for accessibility testing. |
| `updateGraphForTicker` | Regenerates market data, recolors the line chart, and updates headings. |
| `changeTitle` | Rebrands the article header and surfaces alerts. |
| `scrollPage`, `autoScroll`, `stopAutoScroll` | Automates navigation to validate long-form reading scenarios. |
| `addToWatchlist`, `removeFromWatchlist`, `clearWatchlist` | Exercises list manipulation and alert messaging. |
| `subscribeToAuthor`, `saveArticle`, `emailArticle` | Mimics workflow actions captured by analytics hooks. |
| `getRecommendedArticles`, `showCompany`, `highlightArticleContent` | Shows how tools can query DOM state and surface contextual UI. |
| `openChartGallery`, `navigateChartGallery` | Drives the new chart lightbox at native resolution. |

> Tip: Every tool logs `trackGAEvent` calls, making it easy to confirm telemetry wiring while iterating.

## Getting started locally

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+

### Install & run

```bash
git clone https://github.com/brianscott1980-cyber/webmcp.git
cd webmcp
npm install
npm start
```

The dev server defaults to `http://localhost:3000`. Open it directly or through the WebMCP preview panel inside VS Code.

### Available scripts

- `npm start` – launches the CRA development server.
- `npm test` – runs Jest tests in watch mode (used for smoke validation).
- `npm run build` – creates a production build.

## Project structure

```
src/
  App.js                    # Main dashboard with MCP server tooling
  realisticArticleContent.js# Rich article markup with chart metadata
  components/               # Panels, dialogs, overlays, charts, prompts
  hooks/useReadSections.js  # Read-progress tracking for article sections
public/assets/Chart*.png    # High-resolution charts used in the gallery
```

Key UI surfaces include `ArticleActions`, `ArticleSidePanel`, `CompanyModal`, `MarketsGraph`, and the chart gallery overlay rendered from `App.js`.

## Working with assets & content

- Article HTML lives in `realisticArticleContent.js` and includes `data-chart-index` attributes so the gallery can map images declaratively.
- Chart images reside in `public/assets`. This allows direct use of `/assets/Chart1.png` paths in rendered markup (Webpack serves them statically).
- You can add new MCP tools by extending the `server.tool` registrations in `App.js`—they immediately appear to WebMCP without additional wiring.

## Validation status

During documentation update, automated tests were **not** re-run. Use `npm test` or `npm run lint` (if configured) before committing further changes.

## Contributing

Issues and pull requests are welcome. If you introduce new MCP tools or UI behaviors, please update this README so other testers know what to try.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/my-update`).
3. Commit your changes with context (`git commit -m "Add new MCP sandbox tool"`).
4. Push and open a pull request describing the new behaviors.

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.



