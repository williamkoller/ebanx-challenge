import { Account, Transaction } from '../../domain/entities/account';

export interface TransactionStrategy<T> {
  execute(
    accounts: Record<string, Account>,
    transaction: Transaction,
  ): T | number;
}
