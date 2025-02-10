import { Account } from '../../domain/entities/account';

export type DepositDto = {
  destination: {
    id: string;
    balance: number;
  };
};

export type WithdrawDto = {
  origin: {
    id: string;
    balance: number;
  };
};

export type TransferDto = {
  origin: {
    id: string;
    balance: number;
  };
  destination: {
    id: string;
    balance: number;
  };
};

export class TransactionMapper {
  static mapDeposit(account: Account): DepositDto {
    return { destination: { id: account.id, balance: account.balance } };
  }

  static mapWithdraw(account: Account): WithdrawDto {
    return { origin: { id: account.id, balance: account.balance } };
  }

  static mapTransfer(origin: Account, destination: Account): TransferDto {
    return {
      origin: { id: origin.id, balance: origin.balance },
      destination: { id: destination.id, balance: destination.balance },
    };
  }
}
