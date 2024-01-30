import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
import { OrderStatus } from 'src/orders/entities/enums/order-status.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoriesService,
  ) {}
  async create(createProductDto: CreateProductDto, req: any): Promise<Product> {
    const category = await this.getCategory(createProductDto);
    const currentUser = await this.categoryService.currentUser(req);
    const produce = await this.productRepository.create(createProductDto);
    // const p = Object.assign(Product,createProductDto);
    produce.category = category;
    produce.addedBy = currentUser;
    return await this.productRepository.save(produce);
  }

  private async getCategory(ProductDto): Promise<Category> {
    return await this.categoryService.findOne(+ProductDto.categoryId);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { addedBy: true, category: true },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
        category: {
          id: true,
          title: true,
        },
      },
    });
    if (!product) throw new NotFoundException('Product not found.');
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    req: any,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    product.addedBy = await this.categoryService.currentUser(req);
    if (updateProductDto.categoryId) {
      const category = await this.getCategory(updateProductDto);
      product.category = category;
    }
    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    return await this.productRepository.delete(id);
  }
  async updateStock(id: number, stock: number, status: string) {
    let product = await this.findOne(id);
    if (status === OrderStatus.DELIVERED) {
      product.stock -= stock;
    } else {
      product.stock += stock;
    }
    product = await this.productRepository.save(product);
    return product;
  }
}
