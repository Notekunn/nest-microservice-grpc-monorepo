# Auth Service

A gRPC-based authentication microservice built with NestJS.

## Features

- User registration
- User login with JWT tokens
- Token validation
- Token refresh
- User logout
- Password change
- JWT-based authentication
- bcrypt password hashing

## Running the Service

### Development
```bash
pnpm nx serve service-auth
```

### Production Build
```bash
pnpm nx build service-auth
```

### Run Built Service
```bash
node dist/apps/service-auth/main.js
```

## Configuration

The service uses the following environment variables:

- `GRPC_PORT` - gRPC server port (default: 5001)
- `JWT_SECRET` - Secret key for JWT signing (default: 'your-secret-key-change-in-production')

**Important:** Change the JWT_SECRET in production!

## gRPC API

The service exposes the following gRPC methods:

### Register
Register a new user.
```protobuf
rpc Register(RegisterRequest) returns (RegisterResponse);
```

### Login
Authenticate a user and receive JWT tokens.
```protobuf
rpc Login(LoginRequest) returns (LoginResponse);
```

### ValidateToken
Validate a JWT access token.
```protobuf
rpc ValidateToken(ValidateTokenRequest) returns (ValidateTokenResponse);
```

### RefreshToken
Refresh an expired access token using a refresh token.
```protobuf
rpc RefreshToken(RefreshTokenRequest) returns (RefreshTokenResponse);
```

### Logout
Invalidate a user's refresh token.
```protobuf
rpc Logout(LogoutRequest) returns (LogoutResponse);
```

### ChangePassword
Change a user's password.
```protobuf
rpc ChangePassword(ChangePasswordRequest) returns (ChangePasswordResponse);
```

## Test Credentials

A test user is automatically created on startup:
- Email: `test@example.com`
- Password: `password123`

## Using in Other Services

To use authentication in other services, import the SharedAuthModule from @nest-mono/shared-grpc:

```typescript
import { Module } from '@nestjs/common';
import { SharedAuthModule } from '@nest-mono/shared-grpc';

@Module({
  imports: [SharedAuthModule],
  // ...
})
export class YourModule {}
```

### Protecting Routes with JWT Guard

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@nest-mono/shared-grpc';

@Controller('protected')
export class ProtectedController {
  @Get()
  @UseGuards(JwtAuthGuard)
  protectedRoute() {
    return { message: 'This route is protected' };
  }
}
```

### Protecting gRPC Methods

```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcAuthGuard } from '@nest-mono/shared-grpc';

@Controller()
export class YourGrpcController {
  @GrpcMethod('YourService', 'ProtectedMethod')
  @UseGuards(GrpcAuthGuard)
  protectedMethod(data: any, metadata: any) {
    // Access user info from data.user
    const { userId, email, roles } = data.user;
    return { message: 'Protected gRPC method' };
  }
}
```

## Proto Definition

The auth service proto is located at:
`libs/shared-grpc/src/proto/auth.proto`

## Architecture Notes

- **In-memory storage**: Currently uses in-memory storage for demo purposes. Replace with a database in production.
- **Password hashing**: Uses bcryptjs with salt rounds of 10
- **Token expiry**: Access tokens expire in 1 hour, refresh tokens in 7 days
- **JWT payload**: Contains user ID, email, and roles

## Security Considerations

1. Change the JWT_SECRET in production
2. Use HTTPS/TLS for production deployments
3. Implement rate limiting for authentication endpoints
4. Add database persistence instead of in-memory storage
5. Implement token blacklisting for logout
6. Add account lockout after failed login attempts
7. Implement password strength validation
8. Add email verification for new registrations
