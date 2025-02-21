import { HttpException, HttpStatus } from '@nestjs/common';
import { TransactionStrategy } from '../transaction-strategy.interface';
import {
  DepositDto,
  TransactionMapper,
} from '../../mappers/transaction-mapper';
import { Account, Transaction } from '../../../domain/entities/account';
import * as AsyncLock from 'async-lock';

const lock = new AsyncLock();

export class DepositStrategy implements TransactionStrategy<DepositDto> {
  async execute(accounts: Record<string, Account>, transaction: Transaction) {
    const { destination, amount } = transaction;

    if (!destination) {
      throw new HttpException(
        'Destination account is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await lock.acquire(destination, async () => {
      if (!accounts[destination]) {
        accounts[destination] = Account.create({
          id: destination,
          balance: 0,
          transactions: [transaction],
        });
      }

      await Promise.resolve(accounts[destination].deposit(amount));
      return TransactionMapper.mapDeposit(accounts[destination]);
    });
  }
}
