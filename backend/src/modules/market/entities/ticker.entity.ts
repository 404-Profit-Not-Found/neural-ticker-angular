import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity('tickers')
export class TickerEntity {
  @PrimaryColumn()
  symbol: string;

  @Column({ nullable: true })
  company_name: string;

  @Column({ nullable: true })
  exchange: string;

  @Column({ nullable: true })
  exchange_mic: string;

  @Column({ nullable: true })
  listing_country: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  isin: string;

  @Column({ nullable: true })
  cusip: string;

  @Column({ nullable: true })
  asset_class: string;

  @Column({ nullable: true })
  security_type: string;

  @Column({ nullable: true })
  sector: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ type: 'text', nullable: true })
  description_short: string;

  @Column({ nullable: true })
  website_url: string;

  @Column({ nullable: true })
  updated_at: string;
}
