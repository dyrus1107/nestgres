import { Transform } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  public category?: string;
}
