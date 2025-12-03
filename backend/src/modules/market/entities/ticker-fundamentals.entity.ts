import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { TickerEntity } from './ticker.entity';

@Entity('ticker_fundamentals')
export class TickerFundamentalsEntity {
  @PrimaryColumn()
  symbol: string;

  @OneToOne(() => TickerEntity)
  @JoinColumn({ name: 'symbol' })
  ticker: TickerEntity;

  @Column('real', { nullable: true })
  pe_trailing: number;

  @Column('real', { nullable: true })
  pe_forward: number;

  @Column('real', { nullable: true })
  ps_ttm: number;

  @Column('real', { nullable: true })
  revenue_ttm: number;

  @Column('real', { nullable: true })
  net_income_ttm: number;

  @Column('real', { nullable: true })
  eps_ttm: number;

  @Column('real', { nullable: true })
  div_yield_fwd: number;

  @Column({ nullable: true })
  next_earnings_date: string;
}
