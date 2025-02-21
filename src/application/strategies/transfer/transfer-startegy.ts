import { HttpException, HttpStatus } from '@nestjs/common';
import { TransactionStrategy } from '../transaction-strategy.interface';
import {
  TransactionMapper,
  TransferDto,
} from '../../mappers/transaction-mapper';
import { Account, Transaction } from '../../../domain/entities/account';
import * as AsyncLock from 'async-lock';

const lock = new AsyncLock();

export class TransferStrategy implements TransactionStrategy<TransferDto> {
  async execute(
    accounts: Record<string, Account>,
    transaction: Transaction,
  ): Promise<TransferDto | number> {
    const { destination, amount, origin } = transaction;

    if (!destination) {
      throw new HttpException(
        'Destination account is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!origin) {
      throw new HttpException(
        'Origin account is required',
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
      if (!accounts[origin]) {
        return 0;
      }
      await Promise.resolve(
        accounts[origin].transfer(amount, accounts[destination]),
      );
      return TransactionMapper.mapTransfer(
        accounts[origin],
        accounts[destination],
      );
    });
  }
}
