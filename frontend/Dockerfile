FROM node:20.10-alpine

WORKDIR /app

#remove .next and node_modules
RUN rm -rf .next node_modules

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm cache clean --force && \
    npm i

# Copy source code
COPY . .

# Build the application
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

ARG APP_PASSWORD
ENV APP_PASSWORD=${APP_PASSWORD}

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

ARG NEXT_APP_HOST_DOMAIN
ENV NEXT_APP_HOST_DOMAIN=${NEXT_APP_HOST_DOMAIN}

ARG NEXT_APP_QUERY_URL
ENV NEXT_APP_QUERY_URL=${NEXT_APP_QUERY_URL}

EXPOSE 3000

CMD ["npm", "run", "dev"]