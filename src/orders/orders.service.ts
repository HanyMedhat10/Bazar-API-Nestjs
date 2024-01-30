import { CurrentUser } from './../utility/decorators/current-user.decorator';
import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProducts } from './entities/orders-products.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { Shipping } from './entities/shipping.entity';
import { User } from 'src/users/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrdersProducts)
    private readonly ordersProductsRepository: Repository<OrdersProducts>,
    private readonly categoriesService: CategoriesService,
    private readonly productService: ProductsService,
  ) {}
  // async create(createOrderDto: CreateOrderDto, req: any): Promise<Order> {
  async create(
    createOrderDto: CreateOrderDto,
    currentUser: User,
  ): Promise<Order> {
    // console.log(req.user);
    // const currentUser = await this.categoriesService.currentUser(req);
    console.log(currentUser);
    const shipping = new Shipping();
    Object.assign(shipping, createOrderDto.shippingAddress);
    const orderEntity = new Order();
    orderEntity.shippingAddress = shipping;
    orderEntity.user = currentUser;
    const orderTbl = await this.orderRepository.save(orderEntity);
    const opEntity: {
      order: Order;
      product: Product;
      productQuantity: number;
      productUnitPrice: number;
    }[] = [];
    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      const order = orderTbl;
      const product = await this.productService.findOne(
        createOrderDto.orderedProducts[i].id,
      );
      const productQuantity = createOrderDto.orderedProducts[i].productQuantity;
      const productUnitPrice =
        createOrderDto.orderedProducts[i].productUnitPrice;
      opEntity.push({ order, product, productQuantity, productUnitPrice });
    }
    const op = await this.ordersProductsRepository
      .createQueryBuilder()
      .insert()
      .into(OrdersProducts)
      .values(opEntity)
      .execute();
    return await this.findOne(orderTbl.id);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async findOne(id: number) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: {
        shippingAddress: true,
        user: true,
        products: { product: true },
      },
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await `This action updates a #${id} order`;
  }

  async remove(id: number) {
    return await `This action removes a #${id} order`;
  }
}
