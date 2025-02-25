import { HttpException, HttpStatus } from '@nestjs/common';
import {
  TransactionMapper,
  WithdrawDto,
} from '../../mappers/transaction-mapper';
import { TransactionStrategy } from '../transaction-strategy.interface';
import { Transaction } from '../../../domain/entities/account';
import { ClientSession } from 'mongoose';
import { AccountRepository } from '../../../infra/db/repositories/account-repository.interface'

export class WithdrawStrategy implements TransactionStrategy<WithdrawDto> {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(
    transaction: Transaction,
    session: ClientSession,
  ): Promise<WithdrawDto | number> {
    const { amount, origin } = transaction;

    if (!origin) {
      throw new HttpException(
        'Origin account is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await session.withTransaction(async () => {
      const originAccount = await this.accountRepository.findById(
        origin,
        session,
      );
      if (!originAccount) {
        return 0;
      }

      originAccount.withdraw(amount);

      await this.accountRepository.update(originAccount, session);

      return TransactionMapper.mapWithdraw(originAccount);
    });
  }
}
