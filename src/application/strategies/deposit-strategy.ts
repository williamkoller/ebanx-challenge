import { HttpException, HttpStatus } from '@nestjs/common';
import { TransactionStrategy } from './transaction-strategy.interface';
import { Account, Transaction } from '../../domain/entities/account';
import { DepositDto, TransactionMapper } from '../mappers/transaction-mapper';

export class DepositStrategy implements TransactionStrategy<DepositDto> {
  execute(accounts: Record<string, Account>, transaction: Transaction) {
    const { destination, amount } = transaction;

    if (!destination) {
      throw new HttpException(
        'Destination account is required',
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

    accounts[destination].deposit(amount);
    return TransactionMapper.mapDeposit(accounts[destination]);
  }
}
