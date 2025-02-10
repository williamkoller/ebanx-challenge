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
import { DepositStrategy } from '../../application/strategies/deposit-strategy';
import { WithdrawStrategy } from '../../application/strategies/withdraw.strategy';
import { TransferStrategy } from '../../application/strategies/transfer-startegy';
import { AccountDto } from '../dtos/account.dto';
import {
  DepositDto,
  TransferDto,
  WithdrawDto,
} from '../../application/mappers/transaction-mapper';

@Controller()
export class AccountController {
  accounts: Record<string, Account> = {};
  transactionStrategies: Record<
    string,
    TransactionStrategy<DepositDto | WithdrawDto | TransferDto | number>
  > = {
    deposit: new DepositStrategy(),
    withdraw: new WithdrawStrategy(),
    transfer: new TransferStrategy(),
  };
  @Post('reset')
  @HttpCode(HttpStatus.OK)
  reset() {
    Object.keys(this.accounts).forEach((key) => delete this.accounts[key]);
    return 'OK';
  }

  @Get('balance')
  @HttpCode(HttpStatus.OK)
  getBalance(@Query('account_id') accountId: string, @Res() res: Response) {
    const account = this.accounts[accountId];
    if (!account) {
      return res.status(HttpStatus.NOT_FOUND).send(0);
    }
    return res.status(HttpStatus.OK).json(account.balance);
  }

  @Post('event')
  @HttpCode(HttpStatus.CREATED)
  event(@Body() body: AccountDto, @Res() res: Response) {
    const { type } = body;

    const strategy = this.transactionStrategies[type];
    if (!strategy) {
      throw new HttpException('Invalid event type', HttpStatus.BAD_REQUEST);
    }
    const result = strategy.execute(this.accounts, body);

    if (result === 0) {
      return res.status(HttpStatus.NOT_FOUND).send(0);
    }

    return res.status(HttpStatus.CREATED).send(result);
  }
}
