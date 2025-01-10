# Budget Planner

Aplikacja do planowania budżetu osobistego.

## Struktura projektu

- `planner-api/` - Backend aplikacji (Node.js, Express, Prisma)
- `planner-ui/` - Frontend aplikacji (React, Vite, TypeScript)

## Rozwój lokalny

1. Sklonuj repozytorium
2. Zainstaluj zależności:
```bash
cd planner-api && npm install
cd ../planner-ui && npm install
```

3. Uruchom aplikację:
```bash
# Terminal 1 - Backend
cd planner-api && npm run dev

# Terminal 2 - Frontend
cd planner-ui && npm run dev
```

## Deployment

Aplikacja jest skonfigurowana do automatycznego deploymentu na Render.com przy użyciu pliku `render.yaml`. 