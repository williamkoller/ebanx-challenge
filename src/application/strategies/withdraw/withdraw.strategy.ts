import { HttpException, HttpStatus } from '@nestjs/common';
import {
  TransactionMapper,
  WithdrawDto,
} from '../../mappers/transaction-mapper';
import { TransactionStrategy } from '../transaction-strategy.interface';
import { Account, Transaction } from '../../../domain/entities/account';
import * as AsyncLock from 'async-lock';

const lock = new AsyncLock();
export class WithdrawStrategy implements TransactionStrategy<WithdrawDto> {
  async execute(
    accounts: Record<string, Account>,
    transaction: Transaction,
  ): Promise<WithdrawDto | number> {
    const { amount, origin } = transaction;

    if (!origin) {
      throw new HttpException(
        'Origin account is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await lock.acquire(origin, async () => {
      if (!accounts[origin]) {
        return 0;
      }
      await Promise.resolve(accounts[origin].withdraw(amount));
      return TransactionMapper.mapWithdraw(accounts[origin]);
    });
  }
}
