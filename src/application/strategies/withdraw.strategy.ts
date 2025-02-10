import { HttpException, HttpStatus } from '@nestjs/common';
import { TransactionStrategy } from './transaction-strategy.interface';
import { Account, Transaction } from '../../domain/entities/account';
import { TransactionMapper, WithdrawDto } from '../mappers/transaction-mapper';

export class WithdrawStrategy implements TransactionStrategy<WithdrawDto> {
  execute(
    accounts: Record<string, Account>,
    transaction: Transaction,
  ): WithdrawDto | number {
    const { amount, origin } = transaction;

    if (!origin) {
      throw new HttpException(
        'Origin account is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!accounts[origin]) {
      return 0;
    }
    accounts[origin].withdraw(amount);
    return TransactionMapper.mapWithdraw(accounts[origin]);
  }
}
