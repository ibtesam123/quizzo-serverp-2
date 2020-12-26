import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entity/category.entity';
import { CategoryResponse } from 'src/response/category.response';
import { CategoryDTO } from 'src/validation/category.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    ) { }

    async getAllCategory(): Promise<CategoryResponse> {
        let categories = await this.categoryRepo.find()
        return {
            success: true,
            data: categories
        }
    }

    async getCategory(catID: number): Promise<CategoryResponse> {
        let category = await this.categoryRepo.findOne(catID)

        if (!category)
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND)

        return {
            success: true,
            data: category
        }
    }

    async createCategory(categoryDTO: CategoryDTO): Promise<CategoryResponse> {

        await this.categoryRepo.insert(categoryDTO)
            .catch(({ message }) => {
                console.log(message)
                if (message.includes('duplicate'))
                    throw new HttpException('Category already exists', HttpStatus.BAD_REQUEST)
                throw new HttpException('Cannot create category', HttpStatus.BAD_REQUEST)
            })

        let category = await this.categoryRepo.findOne({
            where: {
                name: categoryDTO.name
            }
        })

        return {
            success: true,
            data: category,
        }
    }

    async updateCategory(catID: number, categoryDTO: CategoryDTO): Promise<CategoryResponse> {

        let category = await this.categoryRepo.findOne(catID)

        if (!category)
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND)

        await this.categoryRepo.update(catID, categoryDTO)
            .catch(({ message }) => {
                console.log(message)
                throw new HttpException('Cannot update category', HttpStatus.BAD_REQUEST)
            })

        category = await this.categoryRepo.findOne(catID)

        return {
            success: true,
            data: category,
        }
    }

    async deleteCategory(catID: number): Promise<CategoryResponse> {
        let category = await this.categoryRepo.findOne(catID);

        if (!category)
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND)

        await this.categoryRepo.delete(category)
            .catch(({ message }) => {
                console.log(message)
                throw new HttpException('Cannot delete category', HttpStatus.BAD_REQUEST)
            })

        return {
            success: true,
            data: category,
        }
    }
}
