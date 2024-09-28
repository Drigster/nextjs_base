## Getting Started

### 1.Install dependencies

```bash
npm i
# or
yarn i
# or
pnpm i
# or
bun i
```

### 2.Create .env file

Copy .env.example to .env

```bash
cp .env.example .env
```

### 3.Create database

```bash
npx prisma generate
# or
yarn prisma generate
# or
pnpm prisma generate
# or
bun prisma generate
```

### 4.Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
