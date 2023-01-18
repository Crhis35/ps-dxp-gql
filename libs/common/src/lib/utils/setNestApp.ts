import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { secureApplication } from '../security/helmet';
import { CustomValidationError } from './filters/CustomValidationError';

export function setNestApp<T extends INestApplication>(app: T): void {
  secureApplication(app);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      validationError: {
        value: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((e) => new CustomValidationError(e)),
        );
      },
    }),
  );
}
