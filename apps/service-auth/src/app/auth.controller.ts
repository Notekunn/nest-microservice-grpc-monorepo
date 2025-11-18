import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  async register(data: any) {
    this.logger.log(`Register request received: ${data.email}`);
    return this.authService.register(data);
  }

  @GrpcMethod('AuthService', 'Login')
  async login(data: any) {
    this.logger.log(`Login request received: ${data.email}`);
    return this.authService.login(data);
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(data: any) {
    this.logger.log('ValidateToken request received');
    return this.authService.validateToken(data);
  }

  @GrpcMethod('AuthService', 'RefreshToken')
  async refreshToken(data: any) {
    this.logger.log('RefreshToken request received');
    return this.authService.refreshToken(data);
  }

  @GrpcMethod('AuthService', 'Logout')
  async logout(data: any) {
    this.logger.log(`Logout request received: ${data.userId}`);
    return this.authService.logout(data);
  }

  @GrpcMethod('AuthService', 'ChangePassword')
  async changePassword(data: any) {
    this.logger.log(`ChangePassword request received: ${data.userId}`);
    return this.authService.changePassword(data);
  }
}
