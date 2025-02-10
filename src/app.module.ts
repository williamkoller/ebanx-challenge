import { Module } from '@nestjs/common';
import { AccountController } from './presentation/controllers/account.controller';

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [],
})
export class AppModule {}
