FROM node:16-alpine as builder

ENV NODE_ENV build

USER node

WORKDIR /home/node

COPY package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build 



# --- Production

FROM node:16-alpine

ENV NODE_ENV production

USER node

WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/.env ./

RUN npm prune --production


CMD ["node", "dist/main.js"]