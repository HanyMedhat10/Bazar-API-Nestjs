import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @CreateDateColumn()
  createAt: Timestamp;
  @UpdateDateColumn()
  updateAt: Timestamp;
  @ManyToOne(() => User, (user) => user.categories)
  addedBy: User;
  @OneToMany(() => Product, (product) => product.addedBy)
  products: Product[];
}
