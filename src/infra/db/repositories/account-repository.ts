import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { AccountModel, AccountDocument } from '../models/account-model';
import { AccountRepository } from './account-repository.interface';
import { Account } from '../../../domain/entities/account';

@Injectable()
export class MongooseAccountRepository implements AccountRepository {
  constructor(
    @InjectModel(AccountModel.name)
    private accountModel: Model<AccountDocument>,
  ) {}

  async findById(accountId: string): Promise<Account | null> {
    const accountDoc = await this.accountModel
      .findOne({ id: accountId })
      .exec();
    return accountDoc
      ? new Account({
          id: accountDoc.id,
          balance: accountDoc.balance,
          transactions: accountDoc.transactions,
        })
      : null;
  }

  async create(account: Account): Promise<Account> {
    const createdAccount = new this.accountModel({
      id: account.id,
      balance: account.balance,
      transactions: account.transactions,
    });
    await createdAccount.save();
    return new Account({
      id: createdAccount.id,
      balance: createdAccount.balance,
      transactions: createdAccount.transactions,
    });
  }

  async update(account: Account, session: ClientSession): Promise<void> {
    await this.accountModel
      .findOneAndUpdate(
        {
          id: account.id,
          isProcessed: false,
        },
        {
          $inc: { balance: account.balance },
          $push: { transactions: { $each: account.transactions } },
          isProcessed: true, 
        },
        {
          session,
          new: true, 
          runValidators: true,
          upsert: false,
        },
      )
      .exec();
  }

  async deleteAll(): Promise<void> {
    await this.accountModel.deleteMany({});
  }

  async startSession() {
    return this.accountModel.db.startSession();
  }
}
