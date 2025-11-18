import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

/**
 * Guard for validating JWT tokens in gRPC requests
 * Extracts token from gRPC metadata
 */
@Injectable()
export class GrpcAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const type = context.getType();

    if (type === 'rpc') {
      return this.validateGrpcRequest(context);
    }

    // For HTTP requests, extract from header
    const request = context.switchToHttp().getRequest();
    return this.validateHttpRequest(request);
  }

  private validateGrpcRequest(context: ExecutionContext): boolean {
    try {
      const metadata = context.getArgByIndex(1); // gRPC metadata is second argument
      const authHeader = metadata?.get('authorization')?.[0];

      if (!authHeader) {
        throw new UnauthorizedException('No authorization token provided');
      }

      const token = authHeader.replace('Bearer ', '');
      const decoded = this.jwtService.verify(token);

      // Attach user to context
      const data = context.switchToRpc().getData();
      data.user = {
        userId: decoded.sub,
        email: decoded.email,
        roles: decoded.roles,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private validateHttpRequest(request: any): boolean {
    try {
      const authHeader = request.headers?.authorization;

      if (!authHeader) {
        throw new UnauthorizedException('No authorization token provided');
      }

      const token = authHeader.replace('Bearer ', '');
      const decoded = this.jwtService.verify(token);

      // Attach user to request
      request.user = {
        userId: decoded.sub,
        email: decoded.email,
        roles: decoded.roles,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
