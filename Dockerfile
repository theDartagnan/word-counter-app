# This dockerfile allow to generate a docker image of the application build that include the source-code of the app, its dependencies and build the application in a volume
FROM node:lts-alpine
WORKDIR /app

# Args declaration
ARG PUBLIC_PATH=/
ARG COUNT_DETAILS=0

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application configuration and codebase
COPY . .

# Default command: build app
CMD ["npm", "run", "build"]