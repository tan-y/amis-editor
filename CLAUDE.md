# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an amis visual editor demo project that provides a drag-and-drop interface for creating amis JSON schemas. Amis is a low-code framework for building admin dashboards and forms using JSON configurations.

**Important**: This project requires familiarity with React. If you're not familiar with React, consider using [速搭](https://aisuda.baidu.com/) instead.

## Common Commands

- `npm i` - Install dependencies
- `npm run dev` - Start development server (runs on port 80)
- `npm run build` - Build for production (outputs to ./demo-6.11.0/)
- `npm run format` - Format code using Prettier

## Architecture Overview

### Core Technologies
- **React 16.14** with functional components and hooks
- **MobX State Tree** for state management (not Redux)
- **amis 6.11.0** - The core low-code framework
- **amis-editor 6.11.0** - Visual editor components
- **TypeScript** for type safety
- **React Router 5** for routing

### Application Structure

```
src/
├── App.tsx           # Root component with MobX provider setup
├── index.tsx         # Entry point with theme configuration
├── component/        # Reusable components
├── editor/          # Custom editor plugins
├── renderer/        # Custom amis renderers
├── route/           # Route components (Editor, Preview, etc.)
├── store/           # MobX State Tree stores
├── icons/           # Custom SVG icons
└── scss/            # Styling
```

### State Management (MobX State Tree)

The application uses MobX State Tree with a centralized store pattern:

- **MainStore** (`src/store/index.ts`): Root store managing pages, UI state, and global settings
- **PageStore** (`src/store/Page.ts`): Individual page schema management
- Store persists to localStorage automatically
- Access store via `inject('store')` in components

### Key Components

**Editor Route** (`src/route/Editor.tsx`):
- Main visual editor interface
- Handles schema editing and preview toggling
- Manages mobile/desktop view modes
- Integrates with amis-editor core

**Custom Renderers** (`src/renderer/`):
- Example: `MyRenderer.tsx` demonstrates custom amis component creation
- Must register with unique `name` property
- Follow amis renderer patterns

**Custom Editor Plugins** (`src/editor/`):
- Example: `MyRenderer.tsx` shows editor plugin creation
- Use new plugin system with `BasePlugin` class
- Can register globally or pass via `plugins` prop

### Development Patterns

1. **Custom Renderer Registration**:
   ```tsx
   @Renderer({
     test: /\bmy-renderer$/,
     name: 'my-renderer'
   })
   ```

2. **Editor Plugin Creation** (New approach):
   ```tsx
   export class MyPlugin extends BasePlugin {
     rendererName = 'my-renderer';
     name = '自定义渲染器';
     // ... plugin configuration
   }
   ```

3. **Store Integration**:
   ```tsx
   export default inject('store')(observer(Component));
   ```

### Configuration Files

- **amis.config.js**: Custom webpack configuration for amis projects
- **tsconfig.json**: TypeScript configuration
- Development server runs on port 80 by default
- Production builds to `./demo-6.11.0/` directory

### Theming

- Uses amis 'cxd' theme by default
- Theme configuration set in `src/index.tsx`
- FontAwesome icons included for UI elements

### Testing and Linting

- No specific test framework configured
- Prettier configured for code formatting
- Run `npm run format` before committing changes

## Important Notes

- The project demonstrates both old and new ways of creating custom amis components
- New plugin system is preferred over deprecated `@RendererEditor` approach
- Store automatically persists to localStorage
- Mobile and desktop preview modes available in editor
- Custom schema URL configured for validation: `${host}/schema.json`