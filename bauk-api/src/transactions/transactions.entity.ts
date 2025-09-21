import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Account } from '../accounts/accounts.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  type: 'cash-out' | 'cash-in';

  @ManyToOne(() => Account, account => account.debitedTransactions)
  debitedAccount: Account;

  @ManyToOne(() => Account, account => account.creditedTransactions)
  creditedAccount: Account;
}