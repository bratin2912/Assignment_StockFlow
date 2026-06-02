FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run prisma:generate

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 5000

CMD ["npm", "start"]
