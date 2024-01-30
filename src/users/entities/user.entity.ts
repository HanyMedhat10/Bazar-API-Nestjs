import { Category } from 'src/categories/entities/category.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Review } from 'src/reviews/entities/review.entity';
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
  @OneToMany(() => Product, (product) => product.addedBy)
  products: Product[];
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
  @OneToMany(() => Order, (order) => order.updatedBy)
  ordersUpdateBy: Order[];
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
