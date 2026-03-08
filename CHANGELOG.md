# Changelog

All notable changes to this project will be documented in this file.

## [1.0.3] - 2026-03-08

### Added
- **Health Check Endpoint**: Added `/health` endpoint that returns `{ status: "ok", timestamp: "..." }` for monitoring and load balancer health checks
- **CORS Support**: Enabled CORS with `origin: true` to allow badges to be embedded in external websites
- **NetworkError Handling**: Added proper error handling for network failures in both badge and rank endpoints, returning 503 Service Unavailable
- **Unit Tests**: Added unit tests for `NetworkError` and `UserNotFoundError` classes in rank-service

### Fixed
- **Dependency Conflicts**: Resolved peer dependency conflicts between:
  - `@fastify/swagger` (upgraded to 9.x for fastify-type-provider-zod compatibility)
  - `@fastify/swagger-ui` (upgraded to 5.x for Fastify v5 compatibility)
  - `fastify-type-provider-zod` (downgraded to 1.2.0 for zod v3 compatibility)
- **Debug Logs**: Removed debug console.log statements from rank-service.ts
- **Unused Variables**: Removed unused `userDataBlocks` variable

### Changed
- **Version Bump**: Updated version from 1.0.1 to 1.0.3

### Notes
- Run `npm install --legacy-peer-deps` before deploying to ensure all peer dependencies are resolved correctly
- The `/health` endpoint can be used by load balancers and monitoring systems
