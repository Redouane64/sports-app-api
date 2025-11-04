import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenStrategyName } from '../strategies/refresh-token-strategy';

export class RefreshTokenGuard extends AuthGuard(RefreshTokenStrategyName) {}
