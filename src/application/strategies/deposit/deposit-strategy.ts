import { HttpException, HttpStatus } from '@nestjs/common';
import { TransactionStrategy } from '../transaction-strategy.interface';
import {
  DepositDto,
  TransactionMapper,
} from '../../mappers/transaction-mapper';
import { Account, Transaction } from '../../../domain/entities/account';
import { AccountRepository } from '../../../infra/db/repositories/account-repository.interface';
import { ClientSession } from 'mongoose';

export class DepositStrategy implements TransactionStrategy<DepositDto> {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(
    transaction: Transaction,
    session: ClientSession,
  ) {
    const { destination, amount } = transaction;

    if (!destination) {
      throw new HttpException(
        'Destination account is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await session.withTransaction(async () => {
      let account = await this.accountRepository.findById(destination, session);

      if (!account) {
        account = Account.create({
          id: destination,
          balance: 0,
          transactions: [],
        });

        await this.accountRepository.create(account, session);
      }

      account.deposit(amount);

      await this.accountRepository.update(account, session);

      return TransactionMapper.mapDeposit(account);
    });
  }
}
