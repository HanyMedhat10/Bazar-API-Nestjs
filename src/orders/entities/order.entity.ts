import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { OrderStatus } from './enums/order-status.enum';
import { User } from 'src/users/entities/user.entity';
import { Shipping } from './shipping.entity';
import { OrdersProducts } from './orders-products.entity';
@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  orderAt: Timestamp;
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: string;
  @Column({ nullable: true })
  shippedAt: Date;
  @Column({ nullable: true })
  deliveredAt: Date;
  @ManyToOne(() => User, (user) => user.ordersUpdateBy)
  updatedBy: User;
  @OneToOne(() => Shipping, (shipping) => shipping.order, { cascade: true })
  @JoinColumn()
  shippingAddress: Shipping;
  @OneToMany(() => OrdersProducts, (op) => op.order, { cascade: true })
  products: OrdersProducts[];
  
//   @OneToOne(() => ShippingEntity, (ship) => ship.order, { cascade: true })
//   @JoinColumn()
//   shippingAddress: ShippingEntity;

//   @OneToMany(() => OrdersProductsEntity, (op) => op.order, { cascade: true })
//   products: OrdersProductsEntity[];

//   @ManyToOne(() => UserEntity, (user) => user.orders)
//   user: UserEntity;
}
