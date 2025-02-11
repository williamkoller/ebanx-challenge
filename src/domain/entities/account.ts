import { DomainValidationException } from '../errors/domain-validation-exception';

export type AccountProps = {
  id: string;
  balance: number;
  transactions: Array<Transaction>;
};

export type Transaction = {
  type: string;
  destination?: string;
  origin?: string;
  amount: number;
};

export class Account {
  constructor(private readonly props: AccountProps) {}

  get id() {
    return this.props.id;
  }

  get balance() {
    return this.props.balance;
  }

  set balance(value: number) {
    this.props.balance = value;
  }

  get transactions(): Array<Transaction> {
    return this.props.transactions;
  }

  set transactions(value: Transaction) {
    this.props.transactions.push(value);
  }

  deposit(amount: number) {
    this.balance += amount;
    this.transactions.push({ type: 'deposit', destination: this.id, amount });
  }

  withdraw(amount: number) {
    if (this.balance < amount) {
      throw new DomainValidationException('');
    }
    this.balance -= amount;
    this.transactions.push({ type: 'withdraw', origin: this.id, amount });
  }

  transfer(amount: number, destination: Account) {
    if (this.balance < amount) {
      throw new DomainValidationException();
    }
    this.balance -= amount;
    destination.deposit(amount);
    this.transactions.push({
      type: 'transfer',
      origin: this.id,
      destination: destination.id,
      amount,
    });
  }

  static create(props: AccountProps): Account {
    return new Account(props);
  }
}
