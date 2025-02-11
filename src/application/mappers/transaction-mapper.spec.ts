import { TransactionMapper } from '../../application/mappers/transaction-mapper';
import { Account } from '../../domain/entities/account';

describe('TransactionMapper', () => {
  it('mapDeposit should return correct DepositDto', () => {
    const accountProps = { id: '123', balance: 1000, transactions: [] };
    const account = new Account(accountProps);
    const result = TransactionMapper.mapDeposit(account);

    expect(result).toEqual({
      destination: { id: '123', balance: 1000 },
    });
  });

  it('mapWithdraw should return correct WithdrawDto', () => {
    const accountProps = { id: '456', balance: 500, transactions: [] };
    const account = new Account(accountProps);
    const result = TransactionMapper.mapWithdraw(account);

    expect(result).toEqual({
      origin: { id: '456', balance: 500 },
    });
  });

  it('mapTransfer should return correct TransferDto', () => {
    const transaction = {
      type: 'transfer',
      origin: '789',
      destination: '101',
      amount: 300,
    };
    const originAccountProps = {
      id: '789',
      balance: 700,
      transactions: [transaction],
    };
    const destinationAccountProps = {
      id: '101',
      balance: 300,
      transactions: [transaction],
    };
    const origin = new Account(originAccountProps);
    const destination = new Account(destinationAccountProps);

    const result = TransactionMapper.mapTransfer(origin, destination);

    expect(result).toEqual({
      origin: { id: '789', balance: 700 },
      destination: { id: '101', balance: 300 },
    });
  });
});
