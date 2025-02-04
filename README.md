# Express TypeScript Boilerplate

A secure and well-structured Express.js boilerplate with TypeScript support, featuring comprehensive security measures, utility classes, and best practices.

## Features

- **TypeScript Support**: Full TypeScript integration with strict type checking
- **Security Features**:
  - Helmet for secure HTTP headers
  - CORS protection with configurable origins
  - Rate limiting to prevent brute force attacks
  - AES-256 encryption utilities (CBC and GCM modes)
  - Secure password hashing with bcrypt
  - Input validation
- **Logging & Monitoring**:
  - Winston logger integration
  - Request logging middleware
  - Structured logging format
- **Error Handling**:
  - Centralized error handling
  - Custom error classes
  - Standardized API responses
- **Configuration**:
  - Environment-based configuration
  - Secure secrets management
  - Type-safe configuration access

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hubertme/express-ts-boilerplate.git
cd express-ts-boilerplate
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp envs/.example.env envs/.development.env
```
Edit `.development.env` with your configuration.

4. Start the development server:
```bash
npm run start:dev
```

## Environment Configuration

The application uses environment-specific configuration files located in the `envs` directory:

- `.example.env`: Template for environment variables
- `.development.env`: Development environment configuration
- `.production.env`: Production environment configuration

Required environment variables:
```
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
ENCRYPTION_KEY=your-32-character-encryption-key
ENCRYPTION_IV=your-16-char-iv
```

## Security Features

### Encryption Utility

The `EncryptionUtil` class provides secure encryption and hashing methods:

```typescript
// Password Hashing
const hashedPassword = await EncryptionUtil.hashPassword('userPassword');
const isValid = await EncryptionUtil.comparePassword('userPassword', hashedPassword);

// AES-256-CBC Encryption
const encrypted = EncryptionUtil.encryptAES256CBC('sensitive data', secretKey, iv);
const decrypted = EncryptionUtil.decryptAES256CBC(encrypted.hash, secretKey, encrypted.iv);

// AES-256-GCM Encryption (with authentication)
const encrypted = EncryptionUtil.encryptAES256GCM('sensitive data', secretKey, iv);
const decrypted = EncryptionUtil.decryptAES256GCM(
  encrypted.hash,
  secretKey,
  encrypted.iv,
  encrypted.authTag
);
```

### API Response Utility

Standardized API responses using the `ApiResponse` class:

```typescript
// Success response
ApiResponse.success(res, data, 'Operation successful');

// Error response
ApiResponse.error(res, 'Something went wrong', 500);

// Common status codes
ApiResponse.created(res, newResource);
ApiResponse.notFound(res, 'Resource not found');
ApiResponse.unauthorized(res, 'Invalid credentials');
```

## Logging

The application uses Winston for structured logging:

```typescript
import { logger } from './utils/logger';

logger.info('Operation successful', { operation: 'create', resourceId: 123 });
logger.error('Operation failed', { error: err, context: 'user-service' });
```

Logs are stored in:
- `logs/error.log`: Error-level logs
- `logs/combined.log`: All logs

## Security Best Practices

1. **Environment Variables**:
   - Never commit sensitive data to version control
   - Use different configurations for development and production
   - Validate environment variables at startup

2. **API Security**:
   - Always validate input data
   - Use HTTPS in production
   - Implement rate limiting
   - Configure CORS appropriately

3. **Password Security**:
   - Always hash passwords with bcrypt
   - Never store plain-text passwords
   - Use secure encryption keys

## Production Deployment Checklist

- [ ] Set secure environment variables
- [ ] Configure CORS with specific origins
- [ ] Enable HTTPS
- [ ] Set appropriate rate limits
- [ ] Configure logging levels
- [ ] Review security headers
- [ ] Set up monitoring
- [ ] Configure error reporting

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
