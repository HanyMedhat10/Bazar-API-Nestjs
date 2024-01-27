import { Category } from 'src/categories/entities/category.entity';
import { Role } from 'src/utility/common/user-roles-enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ select: false })
  password: string;
  @Column({ type: 'enum', enum: Role, array: true, default: [Role.USER] })
  roles: Role[];
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;
  @OneToMany(() => Category, (category) => category.addedBy)
  categories: Category[];
}
