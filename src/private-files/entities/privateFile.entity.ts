import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PrivateFile{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  key: string;
  @ManyToOne(()=> User,(owner:User) => owner.files)
  owner: User;
}