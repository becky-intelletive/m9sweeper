import { Global, Module } from '@nestjs/common';
import { GatekeeperService } from './services/gatekeeper.service';
import { GatekeeperController } from './controllers/gatekeeper.controller';

@Global()
@Module({
  providers: [
    GatekeeperService,
  ],
  exports: [
    GatekeeperService,
  ],
  controllers: [
    GatekeeperController,
  ],

})
export class GatekeeperModule {}
