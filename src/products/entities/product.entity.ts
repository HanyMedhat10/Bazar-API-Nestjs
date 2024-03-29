import { Category } from 'src/categories/entities/category.entity';
import { OrdersProducts } from 'src/orders/entities/orders-products.entity';
import { Review } from 'src/reviews/entities/review.entity';
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

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;
  @Column()
  stock: number;
  @Column('simple-array')
  images: string[];
  @CreateDateColumn()
  createAt: Timestamp;
  @UpdateDateColumn()
  updateAt: Timestamp;
  @ManyToOne(() => User, (user) => user.products)
  addedBy: User;
  @ManyToOne(() => Category, (cat) => cat.products)
  category: Category;
  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
  @OneToMany(() => OrdersProducts, (op) => op.order, { cascade: true })
  products: OrdersProducts[];
}
