import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

// Interfaces matching proto definitions
interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ValidateTokenRequest {
  token: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface ChangePasswordRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  roles: string[];
  createdAt: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  // In-memory user storage (replace with database in production)
  private users: Map<string, User> = new Map();
  private refreshTokens: Map<string, string> = new Map(); // userId -> refreshToken

  constructor(private jwtService: JwtService) {
    // Seed with a test user for demo purposes
    this.seedTestUser();
  }

  private async seedTestUser() {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser: User = {
      id: '1',
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      roles: ['user'],
      createdAt: Date.now(),
    };
    this.users.set(testUser.email, testUser);
    this.logger.log('Test user created: test@example.com / password123');
  }

  async register(request: RegisterRequest) {
    try {
      // Check if user already exists
      if (this.users.has(request.email)) {
        return {
          success: false,
          message: 'User already exists',
          userId: '',
          accessToken: '',
          refreshToken: '',
          expiresIn: 0,
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(request.password, 10);

      // Create user
      const user: User = {
        id: Date.now().toString(),
        email: request.email,
        password: hashedPassword,
        firstName: request.firstName,
        lastName: request.lastName,
        phone: request.phone,
        roles: ['user'],
        createdAt: Date.now(),
      };

      this.users.set(user.email, user);
      this.logger.log(`User registered: ${user.email}`);

      // Generate tokens
      const { accessToken, refreshToken, expiresIn } =
        await this.generateTokens(user);

      return {
        success: true,
        message: 'User registered successfully',
        userId: user.id,
        accessToken,
        refreshToken,
        expiresIn,
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      return {
        success: false,
        message: 'Registration failed',
        userId: '',
        accessToken: '',
        refreshToken: '',
        expiresIn: 0,
      };
    }
  }

  async login(request: LoginRequest) {
    try {
      // Find user
      const user = this.users.get(request.email);
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
          userId: '',
          accessToken: '',
          refreshToken: '',
          expiresIn: 0,
          user: null,
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        request.password,
        user.password
      );
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials',
          userId: '',
          accessToken: '',
          refreshToken: '',
          expiresIn: 0,
          user: null,
        };
      }

      // Generate tokens
      const { accessToken, refreshToken, expiresIn } =
        await this.generateTokens(user);

      this.logger.log(`User logged in: ${user.email}`);

      return {
        success: true,
        message: 'Login successful',
        userId: user.id,
        accessToken,
        refreshToken,
        expiresIn,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          roles: user.roles,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      return {
        success: false,
        message: 'Login failed',
        userId: '',
        accessToken: '',
        refreshToken: '',
        expiresIn: 0,
        user: null,
      };
    }
  }

  async validateToken(request: ValidateTokenRequest) {
    try {
      const decoded = this.jwtService.verify(request.token);
      return {
        valid: true,
        userId: decoded.sub,
        email: decoded.email,
        roles: decoded.roles || [],
        expiresAt: decoded.exp,
      };
    } catch (error) {
      this.logger.warn(`Token validation failed: ${error.message}`);
      return {
        valid: false,
        userId: '',
        email: '',
        roles: [],
        expiresAt: 0,
      };
    }
  }

  async refreshToken(request: RefreshTokenRequest) {
    try {
      // Verify refresh token
      const decoded = this.jwtService.verify(request.refreshToken);

      // Find user
      const user = Array.from(this.users.values()).find(
        (u) => u.id === decoded.sub
      );
      if (!user) {
        return {
          success: false,
          accessToken: '',
          refreshToken: '',
          expiresIn: 0,
        };
      }

      // Check if refresh token is valid
      const storedRefreshToken = this.refreshTokens.get(user.id);
      if (storedRefreshToken !== request.refreshToken) {
        return {
          success: false,
          accessToken: '',
          refreshToken: '',
          expiresIn: 0,
        };
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      this.logger.log(`Token refreshed for user: ${user.email}`);

      return {
        success: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      };
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      return {
        success: false,
        accessToken: '',
        refreshToken: '',
        expiresIn: 0,
      };
    }
  }

  async logout(request: { userId: string; refreshToken: string }) {
    try {
      this.refreshTokens.delete(request.userId);
      this.logger.log(`User logged out: ${request.userId}`);
      return {
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      this.logger.error(`Logout failed: ${error.message}`);
      return {
        success: false,
        message: 'Logout failed',
      };
    }
  }

  async changePassword(request: ChangePasswordRequest) {
    try {
      // Find user
      const user = Array.from(this.users.values()).find(
        (u) => u.id === request.userId
      );
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Verify old password
      const isOldPasswordValid = await bcrypt.compare(
        request.oldPassword,
        user.password
      );
      if (!isOldPasswordValid) {
        return {
          success: false,
          message: 'Invalid old password',
        };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(request.newPassword, 10);
      user.password = hashedPassword;

      // Update user in storage
      this.users.set(user.email, user);

      this.logger.log(`Password changed for user: ${user.email}`);

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      this.logger.error(`Password change failed: ${error.message}`);
      return {
        success: false,
        message: 'Password change failed',
      };
    }
  }

  private async generateTokens(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Store refresh token
    this.refreshTokens.set(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 hour in seconds
    };
  }
}
