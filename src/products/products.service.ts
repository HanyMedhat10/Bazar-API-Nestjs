import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoriesService,
  ) {}
  async create(createProductDto: CreateProductDto, req: any): Promise<Product> {
    const category = await this.categoryService.findOne(
      +createProductDto.categoryId,
    );
    const currentUser = await this.categoryService.currentUser(req);
    const produce = await this.productRepository.create(createProductDto);
    // const p = Object.assign(Product,createProductDto);
    produce.category = category;
    produce.addedBy = currentUser;
    return await this.productRepository.save(produce);
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
