# React RenderFlow Simulator

Learn React rendering behavior visually.

React RenderFlow Simulator is a premium open-source developer tool for understanding React rendering, state ownership, prop flow, context updates, memoization, list isolation, component boundaries, and architecture decisions.

## Why This Exists

React performance issues often come from architecture choices that are hard to see in code review: state owned too high, broad context providers, prop drilling through unused components, unstable props, and list rows that render together. This project turns those invisible relationships into an interactive graph, timeline, inspector, and scoring system.

## Features

- Interactive React Flow component tree graph
- Editable Architecture Workbench with refactor coach
- React Project Structure Analyzer with local folder import
- Side-by-side Folder Structure Compare with editing, diffing, and exports
- Bad Architecture and Good Architecture modes
- Animated re-render heatmap with green correct renders and red wasted renders
- Why Did This Render inspector
- Render timeline for every simulated interaction
- What If Studio for live architecture tuning and scenario save slots
- Architecture score from 0 to 100
- State Ownership Lab
- Prop Flow Visualizer
- Context Update Lab
- Memoization Lab
- List Rendering Lab
- Architecture Anti-Patterns library
- Real-World Dashboard Demo
- Before vs After architecture diff
- Simulated render cost and profiler flamegraph
- Scenario Builder with realistic presets
- Pro JSX Import powered by Babel parser
- Advisor Suite for prop stability, context splitting, memo decisions, budgets, and responsibility maps
- Markdown architecture report export
- Guided learning missions
- Beginner, Intermediate, and Senior Engineer explanation modes
- Final architecture checklist
- Responsive dark-mode developer SaaS interface

## Screenshots

Screenshots are intentionally left as project placeholders:

- `docs/screenshots/simulator.png`
- `docs/screenshots/inspector.png`
- `docs/screenshots/labs.png`

## Tech Stack

- React 19
- Vite
- JavaScript JSX
- Tailwind CSS
- shadcn/ui-style local primitives
- lucide-react
- React Router
- React Flow via `@xyflow/react`
- Babel parser
- Zustand
- Framer Motion
- No TypeScript
- No backend

## Installation

```bash
npm install
npm run dev
```

## Usage

Open the local Vite URL, choose a lab from the sidebar, switch between Bad Architecture and Good Architecture, then trigger interactions such as search input, modal open, row selection, filter changes, theme context updates, and list item updates.

Click any graph node to inspect why it rendered, whether the render was necessary, which state or prop changed, and whether memoization or boundary redesign would help.

## Learning Goals

- Understand how state placement affects render scope
- See when parent renders cause unnecessary child renders
- Learn why broad context values can invalidate unrelated UI
- Compare prop drilling with focused ownership boundaries
- Understand when memoization helps and when it hides poor architecture
- Practice list row isolation and stable prop design
- Build an intuition for maintainable React component boundaries

## Folder Structure

```text
src/
  app/
  components/
    layout/
    simulator/
    labs/
    ui/
    education/
  pages/
  data/
  store/
  hooks/
  utils/
  styles/
```

## Roadmap

- Add saved scenario presets to local storage
- Add graph export/import JSON
- Add keyboard shortcuts for simulator controls
- Add route-level code splitting

## Contributing

Contributions are welcome. Keep the project frontend-only, JSX-only, and focused on teaching real React rendering behavior through realistic architecture examples.

1. Fork the repository
2. Create a feature branch
3. Keep UI changes consistent with the dark developer-tool aesthetic
4. Run `npm run build`
5. Open a pull request with a clear description

## License

MIT
