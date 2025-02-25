import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { AccountRepository } from '../../../infra/db/repositories/account-repository.interface';
import { Account } from '../../../domain/entities/account';
import {
  DepositDto,
  TransferDto,
  WithdrawDto,
} from '../../mappers/transaction-mapper';
import { TransactionStrategy } from '../../strategies/transaction-strategy.interface';
import { ClientSession } from 'mongoose';
import { AccountDto } from '../../../presentation/dtos/account.dto';

@Injectable()
export class AccountUseCase {
  private transactionStrategies: Record<
    string,
    TransactionStrategy<DepositDto | WithdrawDto | TransferDto | number>
  >;

  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly depositStrategy: TransactionStrategy<DepositDto>,
    private readonly withdrawStrategy: TransactionStrategy<WithdrawDto>,
    private readonly transferStrategy: TransactionStrategy<TransferDto>,
  ) {
    this.transactionStrategies = {
      deposit: this.depositStrategy,
      withdraw: this.withdrawStrategy,
      transfer: this.transferStrategy,
    };
  }

  async getBalance(accountId: string, session: ClientSession): Promise<number> {
    const account = await this.accountRepository.findById(accountId, session);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account.balance;
  }

  async createAccount(
    accountId: string,
    session: ClientSession,
  ): Promise<Account> {
    const existingAccount = await this.accountRepository.findById(
      accountId,
      session,
    );
    if (existingAccount) return existingAccount;

    const newAccount = Account.create({
      id: accountId,
      balance: 0,
      transactions: [],
    });
    return this.accountRepository.create(newAccount, session);
  }

  async resetAccounts(): Promise<void> {
    await this.accountRepository.deleteAll();
  }

  async handleEvent(
    type: string,
    data: AccountDto,
    session: ClientSession,
  ): Promise<DepositDto | WithdrawDto | TransferDto | number> {
    const strategy = this.transactionStrategies[type];

    if (!strategy) {
      throw new BadRequestException('Invalid event type');
    }

    const account = await this.accountRepository.findById(
      data.destination,
      session,
    );
    if (account?.isProcessed)
      throw new ConflictException('Account already processed');

    if (account) {
      account.isProcessed = true;
    }

    if (!account) throw new NotFoundException('Account not found');

    await this.accountRepository.update(account, session);
    try {
      const currentSession = await this.startTransaction();

      const result = await strategy.execute(data, currentSession);

      await this.commitTransaction(currentSession);
      account.isProcessed = false;
      await this.accountRepository.update(account, session);
      return result;
    } catch (error) {
      await this.abortTransaction(session);
      account.isProcessed = false;
      await this.accountRepository.update(account, session);
      throw error
    }
  }

  private async startTransaction() {
    return await this.accountRepository.startSession();
  }

  private async commitTransaction(session: ClientSession) {
    await session.commitTransaction();
    session.endSession();
  }

  private async abortTransaction(session: ClientSession) {
    await session.abortTransaction();
    session.endSession();
  }
}
