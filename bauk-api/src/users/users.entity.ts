import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Account } from '../accounts/accounts.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column()
  password: string;

  @OneToOne(() => Account, account => account.user, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  account: Account;
}