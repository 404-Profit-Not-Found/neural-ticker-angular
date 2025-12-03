import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { TickerEntity } from './ticker.entity';

@Entity('ticker_quotes')
export class TickerQuoteEntity {
  @PrimaryColumn()
  symbol: string;

  @OneToOne(() => TickerEntity)
  @JoinColumn({ name: 'symbol' })
  ticker: TickerEntity;

  @Column('real', { nullable: true })
  last_price: number;

  @Column({ nullable: true })
  last_timestamp: string;

  @Column('real', { nullable: true })
  open: number;

  @Column('real', { nullable: true })
  high: number;

  @Column('real', { nullable: true })
  low: number;

  @Column('real', { nullable: true })
  prev_close: number;

  @Column('integer', { nullable: true })
  volume: number;

  @Column('real', { nullable: true })
  change_pct: number;

  @Column('integer', { nullable: true })
  is_delayed: number; // Boolean 0/1
}
