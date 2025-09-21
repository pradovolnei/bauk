import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany  } from 'typeorm';
import { User } from '../users/users.entity';
import { Transaction } from '../transactions/transactions.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 100.00 })
  balance: number;

  @OneToOne(() => User, user => user.account)
  user: User;

  @OneToMany(() => Transaction, transaction => transaction.debitedAccount)
  debitedTransactions: Transaction[];

  @OneToMany(() => Transaction, transaction => transaction.creditedAccount)
  creditedTransactions: Transaction[];
}