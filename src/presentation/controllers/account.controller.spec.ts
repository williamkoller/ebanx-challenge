import { HttpException, HttpStatus } from '@nestjs/common';
import { Account } from '../../domain/entities/account';

import { AccountController } from '../../presentation/controllers/account.controller';
import { Response } from 'express';

describe('AccountController', () => {
  let accountController: AccountController;
  let response: Response;

  beforeEach(() => {
    accountController = new AccountController();
    response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;
  });

  it('should reset accounts', () => {
    accountController.accounts = {
      '123': new Account({ id: '123', balance: 1000, transactions: [] }),
    };
    accountController.reset(response);
    expect(accountController.accounts).toEqual({});
    expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(response.send).toHaveBeenCalledWith('OK');
  });

  it('should return account balance', () => {
    accountController.accounts['123'] = new Account({
      id: '123',
      balance: 1000,
      transactions: [],
    });
    accountController.getBalance('123', response);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(response.json).toHaveBeenCalledWith(1000);
  });

  it('should return 0 if account does not exist', () => {
    accountController.getBalance('999', response);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(response.send).toHaveBeenCalledWith(0);
  });

  it('should process deposit event', () => {
    accountController.accounts = {};
    const body = {
      type: 'deposit',
      origin: '',
      destination: '123',
      amount: 500,
    };
    accountController.event(body, response);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(response.send).toHaveBeenCalledWith({
      destination: { id: '123', balance: 500 },
    });
  });

  it('should return 0 if withdraw origin account does not exist', () => {
    const body = {
      type: 'withdraw',
      origin: '999',
      amount: 500,
      destination: '',
    };
    accountController.event(body, response);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(response.send).toHaveBeenCalledWith(0);
  });

  it('should throw error for invalid event type', () => {
    const body = {
      type: 'invalid',
      origin: '123',
      amount: 500,
      destination: '',
    };

    expect(() => accountController.event(body, response)).toThrow(
      new HttpException('Invalid event type', HttpStatus.BAD_REQUEST),
    );
  });
});
