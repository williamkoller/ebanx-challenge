import { ClientSession } from 'mongoose'
import { Account, Transaction } from '../../domain/entities/account';

export interface TransactionStrategy<T> {
  execute(
    transaction: Transaction,
    session: ClientSession,
  ): Promise<T | number>;
}
