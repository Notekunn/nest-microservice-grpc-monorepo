/* eslint-disable @typescript-eslint/no-explicit-any */
import { IntersectionType } from '@nestjs/swagger';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export function schemaValidate(cls: ClassConstructor<any>[]) {
  return function (config: any) {
    const validatedConfig = plainToInstance(IntersectionType(...cls), config, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      const errorMessages = errors
        .flatMap((e) => Object.values(e?.constraints || {}))
        .join('\n');
      throw new Error(`Configuration validation error: ${errorMessages}`);
    }
  };
}
