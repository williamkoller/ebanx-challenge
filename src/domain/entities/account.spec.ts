import { DomainValidationException } from '../errors/domain-validation-exception';
import { Account, Transaction } from './account';

describe('Account', () => {
  let account: Account;

  beforeEach(() => {
    account = new Account({ id: '123', balance: 1000, transactions: [] });
  });

  it('should create an account', () => {
    expect(account.id).toBe('123');
    expect(account.balance).toBe(1000);
    expect(account.transactions.length).toBe(0);
  });

  it('should deposit funds', () => {
    account.deposit(500);
    expect(account.balance).toBe(1500);
    expect(account.transactions).toContainEqual({
      type: 'deposit',
      destination: '123',
      amount: 500,
    });
  });

  it('should withdraw funds successfully', () => {
    account.withdraw(500);
    expect(account.balance).toBe(500);
    expect(account.transactions).toContainEqual({
      type: 'withdraw',
      origin: '123',
      amount: 500,
    });
  });

  it('should throw error when withdrawing more than balance', () => {
    expect(() => account.withdraw(1500)).toThrow(DomainValidationException);
  });

  it('should transfer funds successfully', () => {
    const destination = new Account({
      id: '456',
      balance: 500,
      transactions: [],
    });
    account.transfer(300, destination);
    expect(account.balance).toBe(700);
    expect(destination.balance).toBe(800);
    expect(account.transactions).toContainEqual({
      type: 'transfer',
      origin: '123',
      destination: '456',
      amount: 300,
    });
  });

  it('should throw error when transferring more than balance', () => {
    const destination = new Account({
      id: '456',
      balance: 500,
      transactions: [],
    });
    expect(() => account.transfer(1500, destination)).toThrow(
      DomainValidationException,
    );
  });

  it('should add a transaction when setter is used', () => {
    const transaction: Transaction = {
      type: 'deposit',
      destination: '123',
      amount: 200,
    };
    account.transactions = transaction;
    expect(account.transactions).toContainEqual(transaction);
  });
});
