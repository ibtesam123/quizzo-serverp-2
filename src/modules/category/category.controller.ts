import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { IdGuard } from 'src/guards/id.guard';
import { CategoryResponse } from 'src/response/category.response';
import { CategoryDTO } from 'src/validation/category.dto';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) { }

    @Get()
    getAllCategory(): Promise<CategoryResponse> {
        return this.categoryService.getAllCategory()
    }

    @Get(':catID')
    getCategory(@Param('catID') catID: number): Promise<CategoryResponse> {
        return this.categoryService.getCategory(catID)
    }

    @Post()
    @UseGuards(IdGuard, AdminGuard)
    createCategory(@Body() categoryDTO: CategoryDTO): Promise<CategoryResponse> {
        return this.categoryService.createCategory(categoryDTO)
    }

    @Put(':catID')
    @UseGuards(IdGuard, AdminGuard)
    updateCategory(@Param('catID') catID: number, @Body() categoryDTO: CategoryDTO): Promise<CategoryResponse> {
        return this.categoryService.updateCategory(catID, categoryDTO)
    }


    @Delete(':catID')
    @UseGuards(IdGuard, AdminGuard)
    deleteCategory(@Param('catID') catID: number): Promise<CategoryResponse> {
        return this.categoryService.deleteCategory(catID)
    }
}
