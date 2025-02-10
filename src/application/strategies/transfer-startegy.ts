import { HttpException, HttpStatus } from '@nestjs/common';
import { TransactionStrategy } from './transaction-strategy.interface';
import { Account, Transaction } from '../../domain/entities/account';
import { TransactionMapper, TransferDto } from '../mappers/transaction-mapper';

export class TransferStrategy implements TransactionStrategy<TransferDto> {
  execute(
    accounts: Record<string, Account>,
    transaction: Transaction,
  ): TransferDto | number {
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
    accounts[origin].transfer(amount, accounts[destination]);
    return TransactionMapper.mapTransfer(
      accounts[origin],
      accounts[destination],
    );
  }
}
