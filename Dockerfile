# Build stage
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create a script to substitute environment variables
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Substitute environment variables in JavaScript files' >> /docker-entrypoint.sh && \
    echo 'for file in /usr/share/nginx/html/assets/*.js; do' >> /docker-entrypoint.sh && \
    echo '  if [ -f "$file" ]; then' >> /docker-entrypoint.sh && \
    echo '    sed -i "s|VITE_SUPABASE_URL_PLACEHOLDER|${VITE_SUPABASE_URL}|g" "$file"' >> /docker-entrypoint.sh && \
    echo '    sed -i "s|VITE_SUPABASE_ANON_KEY_PLACEHOLDER|${VITE_SUPABASE_ANON_KEY}|g" "$file"' >> /docker-entrypoint.sh && \
    echo '    sed -i "s|VITE_DEV_MODE_PLACEHOLDER|${VITE_DEV_MODE:-false}|g" "$file"' >> /docker-entrypoint.sh && \
    echo '  fi' >> /docker-entrypoint.sh && \
    echo 'done' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Start nginx' >> /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start the application
ENTRYPOINT ["/docker-entrypoint.sh"]