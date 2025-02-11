import { HttpException } from '@nestjs/common';
import { Account, Transaction } from '../../../domain/entities/account';
import { DepositStrategy } from './deposit-strategy';

describe('DepositStrategy', () => {
  let accounts: Record<string, Account>;
  let transaction: Transaction;
  let depositStrategy: DepositStrategy;

  beforeEach(() => {
    accounts = {};
    transaction = { destination: '123', amount: 500 } as Transaction;
    depositStrategy = new DepositStrategy();
  });

  it('should create a new account and deposit amount if account does not exist', () => {
    const result = depositStrategy.execute(accounts, transaction);

    expect(accounts['123']).toBeDefined();
    expect(accounts['123'].balance).toBe(500);
    expect(result).toEqual({ destination: { id: '123', balance: 500 } });
  });

  it('should deposit amount to existing account', () => {
    const accountProps = { id: '123', balance: 1000, transactions: [] };

    accounts['123'] = new Account(accountProps);

    const result = depositStrategy.execute(accounts, transaction);

    expect(accounts['123'].balance).toBe(1500);
    expect(result).toEqual({ destination: { id: '123', balance: 1500 } });
  });

  it('should throw an error if destination account is missing', () => {
    const invalidTransaction = { amount: 500 } as Transaction;

    expect(() => depositStrategy.execute(accounts, invalidTransaction)).toThrow(
      HttpException,
    );
    expect(() => depositStrategy.execute(accounts, invalidTransaction)).toThrow(
      'Destination account is required',
    );
  });
});
