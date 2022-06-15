import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Action {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) action: string;
  @Column() content: string;
}
