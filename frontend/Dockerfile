FROM node:18
WORKDIR /app

# Ensure the official registry (avoids mirror/proxy surprises)
RUN npm config set registry https://registry.npmjs.org/

COPY package.json package-lock.json* ./
# If you keep a lockfile, prefer deterministic install:
# RUN npm ci || npm install
RUN npm install

COPY . .
CMD ["npm", "run", "dev"]
