import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { AuthService } from './auth.service';

// Proto message types
interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ValidateTokenRequest {
  access_token: string;
}

interface RefreshTokenRequest {
  refresh_token: string;
}

interface LogoutRequest {
  access_token: string;
}

interface ChangePasswordRequest {
  user_id: string;
  old_password: string;
  new_password: string;
}

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  async register(data: RegisterRequest) {
    try {
      this.logger.log(`Register request for: ${data.email}`);

      const result = await this.authService.register({
        email: data.email,
        password: data.password,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
      });

      return {
        user: {
          id: result.user.id,
          email: result.user.email,
          first_name: result.user.firstName,
          last_name: result.user.lastName,
          phone: result.user.phone,
          created_at: result.user.createdAt,
          updated_at: result.user.updatedAt,
        },
        tokens: {
          access_token: result.tokens.accessToken,
          refresh_token: result.tokens.refreshToken,
          expires_in: result.tokens.expiresIn,
        },
        message: 'User registered successfully',
      };
    } catch (error) {
      this.logger.error(`Register failed: ${error.message}`);
      throw error;
    }
  }

  @GrpcMethod('AuthService', 'Login')
  async login(data: LoginRequest) {
    try {
      this.logger.log(`Login request for: ${data.email}`);

      const result = await this.authService.login(data.email, data.password);

      return {
        user: {
          id: result.user.id,
          email: result.user.email,
          first_name: result.user.firstName,
          last_name: result.user.lastName,
          phone: result.user.phone,
          created_at: result.user.createdAt,
          updated_at: result.user.updatedAt,
        },
        tokens: {
          access_token: result.tokens.accessToken,
          refresh_token: result.tokens.refreshToken,
          expires_in: result.tokens.expiresIn,
        },
        message: 'Login successful',
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(data: ValidateTokenRequest) {
    try {
      const result = await this.authService.validateToken(data.access_token);

      if (!result.isValid || !result.user) {
        return {
          is_valid: false,
          message: 'Invalid token',
        };
      }

      return {
        is_valid: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          first_name: result.user.firstName,
          last_name: result.user.lastName,
          phone: result.user.phone,
          created_at: result.user.createdAt,
          updated_at: result.user.updatedAt,
        },
        message: 'Token is valid',
      };
    } catch (error) {
      this.logger.error(`ValidateToken failed: ${error.message}`);
      return {
        is_valid: false,
        message: 'Invalid token',
      };
    }
  }

  @GrpcMethod('AuthService', 'RefreshToken')
  async refreshToken(data: RefreshTokenRequest) {
    try {
      const result = await this.authService.refreshToken(data.refresh_token);

      return {
        tokens: {
          access_token: result.accessToken,
          refresh_token: result.refreshToken,
          expires_in: result.expiresIn,
        },
        message: 'Token refreshed successfully',
      };
    } catch (error) {
      this.logger.error(`RefreshToken failed: ${error.message}`);
      throw error;
    }
  }

  @GrpcMethod('AuthService', 'Logout')
  async logout(data: LogoutRequest) {
    try {
      const success = await this.authService.logout(data.access_token);

      return {
        success,
        message: success ? 'Logged out successfully' : 'Logout failed',
      };
    } catch (error) {
      this.logger.error(`Logout failed: ${error.message}`);
      return {
        success: false,
        message: 'Logout failed',
      };
    }
  }

  @GrpcMethod('AuthService', 'ChangePassword')
  async changePassword(data: ChangePasswordRequest) {
    try {
      const success = await this.authService.changePassword(
        data.user_id,
        data.old_password,
        data.new_password
      );

      return {
        success,
        message: 'Password changed successfully',
      };
    } catch (error) {
      this.logger.error(`ChangePassword failed: ${error.message}`);
      throw error;
    }
  }
}
