# Restaurant Frontend

Frontend for a restaurant operations app with two staff experiences:

- **Waiter flow**: select a table, build an order, send it to the kitchen, and receive live status updates.
- **Kitchen flow**: view incoming orders, move items through preparation stages, and mark them as served.

The UI is built with React, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, Socket.IO, and React Hot Toast.

## Features

- Role-based routing for **waiter** and **kitchen** users
- Login and signup screens
- Table selection and order building for waiters
- Live socket updates for new orders and order status changes
- Kitchen workflow board with pending, preparing, ready, and served states
- Order success screen after sending an order
- Toast notifications and sound alerts for kitchen/waiter updates

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Zustand
- TanStack React Query
- Socket.IO client
- Axios
- React Hot Toast
- Howler
- Lucide React

## Project structure

```text
src/
  api/                 REST API wrappers
  components/
    waiterComponents/  Table selection and order UI
  hooks/               Auth and data-fetching hooks
  kitchenPage/         Kitchen workflow board
  lib/                 Axios, socket, and sound utilities
  pages/               Login, signup, waiter, and success screens
  store/               Global Zustand store
  constants/           Static table and menu data
```

## Getting started

### Prerequisites

- Node.js 18+ recommended
- Backend running on `http://localhost:3000`

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the app at the Vite URL shown in the terminal.

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Backend expectations

The frontend expects a backend that exposes:

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/profile`
- `GET /table/all`
- `GET /order/all`

It also expects Socket.IO events for live order updates.

### Socket events used by the app

- `order:new` — waiter sends a new order; kitchen receives it
- `order:update` — kitchen updates an item status; waiter receives status changes
- `order:served` — kitchen marks an item as served
- `order:alert` — kitchen alert notification
- `order:created` / `order:status` — waiter-side listeners used for order confirmation and readiness updates

## User flow

### Waiter

1. Log in.
2. Select a table from the floor plan.
3. Build an order from the menu.
4. Send the order to the kitchen.
5. Review the success screen after the order is accepted.
6. Receive live toast/audio updates when the kitchen changes item status.

### Kitchen

1. Log in with a kitchen role.
2. View the workflow board.
3. Advance items from pending to preparing to ready.
4. Mark items as served.
5. Watch live order counts and served history update automatically.

## Configuration

API and socket URLs are currently set to `http://localhost:3000` in:

- `src/lib/axios.ts`
- `src/lib/socket.ts`

If you move the backend, update those two files.

## Notes

- Menu items and table data are currently seeded from `src/constants/constants.ts`.
- The app uses a shared Zustand store for the selected table, cart, and user session data.
- Audio notifications use `/sound/audio.wav` from the public assets folder.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

