import { Body, Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.getAllCaregories();
  }

  @Get()
  async findCategoryById(@Body() id: string) {
    return this.categoriesService.getCategoryById(+id);
  }
}
