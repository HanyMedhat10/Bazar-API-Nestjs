import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/users/jwt.guard';
import { RoleGuard } from 'src/utility/common/role/role.guard';
import { Category } from './entities/category.entity';
import { Roles } from 'src/utility/common/roles/roles.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  async create(
    @Req() req,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const currentUser = await this.categoriesService.currentUser(req);
    return await this.categoriesService.create(createCategoryDto, currentUser);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return await this.categoriesService.findOne(+id);
  }
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.update(+id, updateCategoryDto);
  }
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.categoriesService.remove(+id);
  }
}
