import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthUser, JwtPayload, TokenPair, UserEntity } from './auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  // In-memory storage for demo purposes
  // In production, this should use a real database
  private users: Map<string, UserEntity> = new Map();
  private refreshTokens: Map<string, string> = new Map(); // token -> userId

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<{ user: AuthUser; tokens: TokenPair }> {
    this.logger.log(`Registering new user: ${data.email}`);

    // Check if user already exists
    const existingUser = Array.from(this.users.values()).find(
      (u) => u.email === data.email
    );

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const userId = this.generateId();
    const now = new Date();
    const user: UserEntity = {
      id: userId,
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(userId, user);

    // Generate tokens
    const tokens = await this.generateTokens(userId, data.email);

    return {
      user: this.toAuthUser(user),
      tokens,
    };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: AuthUser; tokens: TokenPair }> {
    this.logger.log(`Login attempt for: ${email}`);

    // Find user by email
    const user = Array.from(this.users.values()).find(
      (u) => u.email === email
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: this.toAuthUser(user),
      tokens,
    };
  }

  async validateToken(token: string): Promise<{ isValid: boolean; user?: AuthUser }> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const user = this.users.get(payload.sub);

      if (!user) {
        return { isValid: false };
      }

      return {
        isValid: true,
        user: this.toAuthUser(user),
      };
    } catch (error) {
      this.logger.warn(`Token validation failed: ${error.message}`);
      return { isValid: false };
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);
      const userId = this.refreshTokens.get(refreshToken);

      if (!userId || userId !== payload.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = this.users.get(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Revoke old refresh token
      this.refreshTokens.delete(refreshToken);

      // Generate new tokens
      return this.generateTokens(user.id, user.email);
    } catch (error) {
      this.logger.warn(`Refresh token failed: ${error.message}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(token: string): Promise<boolean> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);

      // Remove all refresh tokens for this user
      for (const [refreshToken, userId] of this.refreshTokens.entries()) {
        if (userId === payload.sub) {
          this.refreshTokens.delete(refreshToken);
        }
      }

      this.logger.log(`User ${payload.email} logged out`);
      return true;
    } catch (error) {
      this.logger.warn(`Logout failed: ${error.message}`);
      return false;
    }
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = this.users.get(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    user.updatedAt = new Date();
    this.users.set(userId, user);

    this.logger.log(`Password changed for user: ${userId}`);
    return true;
  }

  private async generateTokens(
    userId: string,
    email: string
  ): Promise<TokenPair> {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // Store refresh token
    this.refreshTokens.set(refreshToken, userId);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  private toAuthUser(user: UserEntity): AuthUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
