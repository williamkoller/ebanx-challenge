import { HttpException } from '@nestjs/common';
import { Account, Transaction } from '../../../domain/entities/account';
import { TransferStrategy } from './transfer-startegy';

describe('TransferStrategy', () => {
  let accounts: Record<string, Account>;
  let transaction: Transaction;
  let transferStrategy: TransferStrategy;

  beforeEach(() => {
    accounts = {
      '123': new Account({ id: '123', balance: 1000, transactions: [] }),
      '456': new Account({ id: '456', balance: 500, transactions: [] }),
    };
    transaction = {
      origin: '123',
      destination: '456',
      amount: 200,
    } as Transaction;
    transferStrategy = new TransferStrategy();
  });

  it('should transfer amount from origin to destination', () => {
    const result = transferStrategy.execute(accounts, transaction);

    expect(accounts['123'].balance).toBe(800);
    expect(accounts['456'].balance).toBe(700);
    expect(result).toEqual({
      origin: { id: '123', balance: 800 },
      destination: { id: '456', balance: 700 },
    });
  });

  it('should create destination account if it does not exist', () => {
    delete accounts['456'];

    const result = transferStrategy.execute(accounts, transaction);

    expect(accounts['456']).toBeDefined();
    expect(accounts['456'].balance).toBe(200);
    expect(result).toEqual({
      origin: { id: '123', balance: 800 },
      destination: { id: '456', balance: 200 },
    });
  });

  it('should return 0 if origin account does not exist', () => {
    delete accounts['123'];

    const result = transferStrategy.execute(accounts, transaction);

    expect(result).toBe(0);
  });

  it('should throw an error if destination account is missing', () => {
    const invalidTransaction = { origin: '123', amount: 200 } as Transaction;

    expect(() =>
      transferStrategy.execute(accounts, invalidTransaction),
    ).toThrow(HttpException);
    expect(() =>
      transferStrategy.execute(accounts, invalidTransaction),
    ).toThrow('Destination account is required');
  });

  it('should throw an error if origin account is missing', () => {
    const invalidTransaction = {
      destination: '456',
      amount: 200,
    } as Transaction;

    expect(() =>
      transferStrategy.execute(accounts, invalidTransaction),
    ).toThrow(HttpException);
    expect(() =>
      transferStrategy.execute(accounts, invalidTransaction),
    ).toThrow('Origin account is required');
  });
});
