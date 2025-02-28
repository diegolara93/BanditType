FROM node:22 as base
WORKDIR /app
COPY package*.json ./
EXPOSE 3000

FROM base as builder
WORKDIR /app
# Install all dependencies (including dev dependencies)
RUN npm install
# Copy all files from current directory to working directory in image
COPY . .
# Build the Next.js application
RUN npm run build

FROM base as production
WORKDIR /app
ENV NODE_ENV=production
# Install only production dependencies
RUN npm ci
# Add group and user with proper syntax
RUN grep -q -E "^nodejs:" /etc/group || addgroup --system --gid 1001 nodejs
RUN grep -q -E "^nextjs:" /etc/passwd || adduser --system --uid 1001 --ingroup nodejs nextjs
# Make sure the .next directory exists and copy everything from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
# Switch to non-root user
USER nextjs
CMD npm start

FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . .
CMD npm run dev