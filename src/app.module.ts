import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountController } from './presentation/controllers/account.controller';
import { AccountUseCase } from './application/usecases/account/account-usecase';
import { AccountModel, AccountSchema } from './infra/db/models/account-model';
import { DepositStrategy } from './application/strategies/deposit/deposit-strategy';
import { WithdrawStrategy } from './application/strategies/withdraw/withdraw.strategy';
import { TransferStrategy } from './application/strategies/transfer/transfer-startegy';
import { MongooseAccountRepository } from './infra/db/repositories/account-repository';
import { AccountRepository } from './infra/db/repositories/account-repository.interface';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/ebanx-challenge'),
    MongooseModule.forFeature([
      { name: AccountModel.name, schema: AccountSchema },
    ]),
  ],
  controllers: [AccountController],
  providers: [
    AccountUseCase,
    {
      provide: AccountUseCase,
      useFactory: (
        accountRepository: AccountRepository,
        depositStrategy: DepositStrategy,
        withdrawStrategy: WithdrawStrategy,
        transferStrategy: TransferStrategy,
      ) => {
        return new AccountUseCase(
          accountRepository,
          depositStrategy,
          withdrawStrategy,
          transferStrategy,
        );
      },
      inject: [
        AccountRepository,
        DepositStrategy,
        WithdrawStrategy,
        TransferStrategy,
      ],
    },
    {
      provide: AccountRepository,
      useClass: MongooseAccountRepository,
    },
    {
      provide: DepositStrategy,
      useFactory: (accountRepository: AccountRepository) => {
        return new DepositStrategy(accountRepository);
      },
      inject: [AccountRepository],
    },
    {
      provide: WithdrawStrategy,
      useFactory: (accountRepository: AccountRepository) => {
        return new WithdrawStrategy(accountRepository);
      },
      inject: [AccountRepository],
    },
    {
      provide: TransferStrategy,
      useFactory: (accountRepository: AccountRepository) => {
        return new TransferStrategy(accountRepository);
      },
      inject: [AccountRepository],
    },
  ],
})
export class AppModule {}
