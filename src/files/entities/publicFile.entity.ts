import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PublicFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  url: string;
}
