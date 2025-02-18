FROM node:18

WORKDIR /app

ARG DATABASE_URL

ENV DATABASE_URL=${DATABASE_URL}

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD npx drizzle-kit push && npm start