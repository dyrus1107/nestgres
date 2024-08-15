import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Address from './address.entity';
import { Post } from 'src/posts/entities/post.entity';
import { PublicFile } from 'src/files/entities/publicFile.entity';
import { PrivateFile } from 'src/private-files/entities/privateFile.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts?: Post[];

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  public avatar?: PublicFile;

  @JoinColumn()
  @OneToMany(() => PrivateFile, (file: PrivateFile) => file.owner)
  files?: PrivateFile[];
}
