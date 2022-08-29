FROM node:16.15.0

WORKDIR /looknote/app
COPY package*.json ./
RUN npm install

RUN npm install -g @nestjs/cli
RUN npm install -g pm2

COPY . .

RUN npx prisma db pull
RUN npx prisma generate
RUN npm run build
EXPOSE 80
CMD ["pm2-runtime", "./dist/main.js"]