import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly categoriesService: CategoriesService,
    private readonly protectService: ProductsService,
  ) {}
  async create(createReviewDto: CreateReviewDto, req: any): Promise<Review> {
    const product = await this.protectService.findOne(
      createReviewDto.productId,
    );
    const currentUser = await this.categoriesService.currentUser(req);
    const userId = await req.user.userId;
    let review = await this.findOneByUserAndProduct(userId, product.id);
    if (!review) {
      review = this.reviewRepository.create(createReviewDto);
      review.user = currentUser;
      review.product = product;
    } else {
      review.comment = createReviewDto.comment;
      review.ratings = createReviewDto.ratings;
    }
    return await this.reviewRepository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find();
  }
  async findAllByProduct(productId: number): Promise<Review[]> {
    // const product = await this.protectService.findOne(productId);
    return await this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }
  async update(id: number, updateReviewDto: UpdateReviewDto, req) {
    const userId = await req.user.userId;
    const review = await this.findOne(id);
    if (userId != review.user.id) throw new UnauthorizedException();
    Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(review);
  }

  async remove(id: number) {
    return await this.reviewRepository.delete(id);
  }
  async findOneByUserAndProduct(userId: number, productId: number) {
    return await this.reviewRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
  }
}
