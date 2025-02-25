import { ClientSession } from 'mongoose';
import { Account } from '../../../domain/entities/account';

export interface AccountRepository {
  findById(accountId: string, session: ClientSession): Promise<Account | null>;
  create(account: Account, session: ClientSession): Promise<Account>;
  update(account: Account, session: ClientSession): Promise<void>;
  deleteAll(): Promise<void>;
  startSession(): Promise<ClientSession>;
}

export const AccountRepository = Symbol('AccountRepository');