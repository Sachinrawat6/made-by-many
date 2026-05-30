# Made by Many

Production-grade React app — shows the team behind every garment order.

## Quick Start

```bash
# Install (run once)
npm install

# Dev server → http://localhost:3000
npm run dev

# Production build → /dist
npm run build

# Preview production build locally
npm run preview
```

## URL Usage

| Pattern | Example |
|---|---|
| Query param | `/?orderId=123` |
| Dynamic route | `/order/123` |

Also accepts `?order_id=` and `?id=` as fallbacks.

## Project Structure

```
src/
├── api/
│   └── nocodb.js          # Axios client + fetchOrderById()
├── constants/
│   └── team.js            # 6 roles with field keys & defaults
├── utils/
│   └── helpers.js         # resolveName, getInitials, parseOrderId
├── hooks/
│   ├── useUrlParams.js    # Reads orderId from URL
│   └── useOrderData.js    # Fetches order, resolves team names
├── components/
│   ├── ui/                # Avatar, Badge, Skeleton, ErrorState
│   ├── layout/            # Header
│   └── order/             # TeamMemberCard, TeamTimeline, OrderMeta
├── pages/
│   ├── MadeByManyPage.jsx # Main page
│   └── NotFoundPage.jsx   # 404
├── App.jsx                # Router
└── main.jsx               # Entry point
```

## Team Roles & Defaults

| Role | NocoDB field (tried in order) | Default |
|---|---|---|
| Store Helper | `Store Helper`, `store_helper` | Sneha |
| Production Flow | `Production Flow`, `production_flow` | Sanjeet |
| Cutting Master | `Cutting Master`, `cutting_master` | Mahesh |
| Tailor | `Tailor`, `tailor` | Shamshool |
| Finishing Team | `Finishing Team`, `finishing_team` | Shahjahan |
| Operation Team | `Operation Team`, `operation_team` | Tanish |

To change field names, edit `src/constants/team.js` → `fieldKeys` array.
