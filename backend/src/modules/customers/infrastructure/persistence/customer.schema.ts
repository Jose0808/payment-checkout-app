import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('customers')
export class CustomerSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 200, name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
