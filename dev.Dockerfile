FROM node:18

WORKDIR /app

ARG DATABASE_URL

ENV DATABASE_URL=${DATABASE_URL}

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx drizzle-kit push

EXPOSE 8000

CMD ["npm", "start"]