FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production --omit=dev

COPY src/ ./src/
# data/db 目录在运行时由程序创建，不需要预置
COPY data/ ./data/

EXPOSE 3001

CMD ["node", "src/app.js"]
