import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpException,
  HttpStatus,
  Res,
  HttpCode,
} from '@nestjs/common';

import { Response } from 'express';
import { Account } from '../../domain/entities/account';
import { TransactionStrategy } from '../../application/strategies/transaction-strategy.interface';
import { AccountDto } from '../dtos/account.dto';
import {
  DepositDto,
  TransferDto,
  WithdrawDto,
} from '../../application/mappers/transaction-mapper';
import { DepositStrategy } from '../../application/strategies/deposit/deposit-strategy';
import { WithdrawStrategy } from '../../application/strategies/withdraw/withdraw.strategy';
import { TransferStrategy } from '../../application/strategies/transfer/transfer-startegy';
import { InjectConnection } from '@nestjs/mongoose';
import { AccountUseCase } from '../../application/usecases/account/account-usecase';
import { Connection } from 'mongoose';

@Controller()
export class AccountController {
  constructor(
    private readonly accountUseCase: AccountUseCase,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  async reset(@Res() res: Response) {
    await this.accountUseCase.resetAccounts();
    return res.status(HttpStatus.OK).send('OK');
  }

  @Get('balance')
  @HttpCode(HttpStatus.OK)
  async getBalance(
    @Query('account_id') accountId: string,
    @Res() res: Response,
  ) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const balance = await this.accountUseCase.getBalance(accountId, session);
      return res.status(HttpStatus.OK).json(balance);
    } catch {
      return res.status(HttpStatus.NOT_FOUND).send(0);
    }
  }

  @Post('event')
  @HttpCode(HttpStatus.CREATED)
  async event(@Body() body: AccountDto, @Res() res: Response) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const result = await this.accountUseCase.handleEvent(
        body.type,
        body,
        session,
      );

      if (result === 0) {
        await session.abortTransaction();
        return res.status(HttpStatus.NOT_FOUND).send(0);
      }

      await session.commitTransaction();
      return res.status(HttpStatus.CREATED).send(result);
    } catch (error) {
      await session.abortTransaction();
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      session.endSession();
    }
  }
}
