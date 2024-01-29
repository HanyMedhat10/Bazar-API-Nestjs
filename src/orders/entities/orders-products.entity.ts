import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'orders_products' })
export class OrdersProducts {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  productUnitPrice: number;
  @Column()
  productQuantity: number;
  @ManyToOne(() => Order, (order) => order.products)
  order: Order;
//   @ManyToOne(() => Product, (prod) => prod.products, { cascade: true })
//   product: Product;

  @ManyToOne(() => Product, (prod) => prod.products)
  product: Product;
}
