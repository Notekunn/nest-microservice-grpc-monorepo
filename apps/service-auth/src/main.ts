import { setup } from '@nest-mono/bootstrap';
import { Logger } from '@nestjs/common';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const logger = new Logger('AuthService');

  try {
    await setup(AppModule, {
      grpc: {
        enabled: true,
        protoFiles: ['auth.proto'],
        package: 'auth',
        url: '0.0.0.0:3201',
      },
    });

    logger.log('Auth service successfully started');
  } catch (error) {
    logger.error('Failed to start auth service', error);
    process.exit(1);
  }
}

bootstrap();
