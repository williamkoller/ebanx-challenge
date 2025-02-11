import { HttpException } from '@nestjs/common';
import { Account, Transaction } from '../../../domain/entities/account';
import { WithdrawStrategy } from './withdraw.strategy';

describe('WithdrawStrategy', () => {
  let accounts: Record<string, Account>;
  let transaction: Transaction;
  let withdrawStrategy: WithdrawStrategy;

  beforeEach(() => {
    accounts = {
      '123': new Account({ id: '123', balance: 1000, transactions: [] }),
    };
    transaction = { origin: '123', amount: 200 } as Transaction;
    withdrawStrategy = new WithdrawStrategy();
  });

  it('should withdraw amount from account', () => {
    const result = withdrawStrategy.execute(accounts, transaction);

    expect(accounts['123'].balance).toBe(800);
    expect(result).toEqual({ origin: { id: '123', balance: 800 } });
  });

  it('should return 0 if origin account does not exist', () => {
    delete accounts['123'];

    const result = withdrawStrategy.execute(accounts, transaction);

    expect(result).toBe(0);
  });

  it('should throw an error if origin account is missing', () => {
    const invalidTransaction = { amount: 200 } as Transaction;

    expect(() =>
      withdrawStrategy.execute(accounts, invalidTransaction),
    ).toThrow(HttpException);
    expect(() =>
      withdrawStrategy.execute(accounts, invalidTransaction),
    ).toThrow('Origin account is required');
  });
});
