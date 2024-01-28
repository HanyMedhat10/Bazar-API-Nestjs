import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    currentUser: User,
  ): Promise<Category> {
    const category = await this.categoryRepository.create(createCategoryDto);
    category.addedBy = currentUser;
    return await this.categoryRepository.save(category);
  }
  async currentUser(req): Promise<User> {
    const id = await req.user.userId;
    return await this.userRepository.findOneBy({ id });
  }
  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({ relations: { addedBy: true } });
    // return await this.categoryRepository.find({ relations: ['addedBy'] });
  }

  async findOne(id: number): Promise<Category> {
    // return await this.categoryRepository.findOneBy({ id });
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: { addedBy: true },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
    if (!category) throw new NotFoundException('Category not found.');
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: Partial<UpdateCategoryDto>,
  ): Promise<Category> {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException(`This id: ${id} not found `);
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  remove(id: number) {
    return this.categoryRepository.delete(id);
  }
}
