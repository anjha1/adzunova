FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY package.json ./
RUN npm install --omit=dev
COPY dist ./dist
ENV NODE_ENV=production
ENV PORT=4110
EXPOSE 4110
CMD ["node", "dist/main.js"]
