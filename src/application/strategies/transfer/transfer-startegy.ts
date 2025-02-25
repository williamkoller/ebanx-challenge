import { HttpException, HttpStatus } from '@nestjs/common';
import { TransactionStrategy } from '../transaction-strategy.interface';
import {
  TransactionMapper,
  TransferDto,
} from '../../mappers/transaction-mapper';
import { Account, Transaction } from '../../../domain/entities/account';
import { AccountRepository } from '../../../infra/db/repositories/account-repository.interface';
import { ClientSession } from 'mongoose';

export class TransferStrategy implements TransactionStrategy<TransferDto> {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(
    transaction: Transaction,
    session: ClientSession,
  ): Promise<TransferDto | number> {
    const { destination, amount, origin } = transaction;

    if (!origin) {
      throw new HttpException(
        'Origin account is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!destination) {
      throw new HttpException(
        'Destination account is required',
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

      let destinationAccount = await this.accountRepository.findById(
        destination,
        session,
      );
      if (!destinationAccount) {
        destinationAccount = Account.create({
          id: destination,
          balance: 0,
          transactions: [],
        });
        await this.accountRepository.create(destinationAccount, session);
      }

      originAccount.transfer(amount, destinationAccount);

      await this.accountRepository.update(originAccount, session);
      await this.accountRepository.update(destinationAccount, session);

      return TransactionMapper.mapTransfer(originAccount, destinationAccount);
    });
  }
}
