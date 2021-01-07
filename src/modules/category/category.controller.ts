import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { extname } from 'path';
import { AdminGuard } from 'src/guards/admin.guard';
import { IdGuard } from 'src/guards/id.guard';
import { DevConfig } from 'src/keys/dev.config';
import { CategoryResponse } from 'src/response/category.response';
import { CategoryDTO } from 'src/validation/category.dto';
import { CategoryService } from './category.service';
import { diskStorage } from 'multer'

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly devConfig: ConfigService<DevConfig>,
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
    async addCategory(@Body() categoryDTO: CategoryDTO): Promise<CategoryResponse> {
        return this.categoryService.createCategory(categoryDTO)
    }

    @Post('/image')
    @UseGuards(IdGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            filename: (req: Request, file, cb) => {
                file.filename = `${req.query.catID}${extname(file.originalname)}`
                cb(null, file.filename)
            },
            destination: './images/category'
        })
    }))
    async uploadImage(
        @UploadedFile() file,
        @Query('catID') catID: number,
    ): Promise<CategoryResponse> {
        let imgURL = this.devConfig.get<string>("BASE_URL") + `/category/images/${file.filename}`
        return this.categoryService.updateCategory(catID, {
            image: imgURL,
        })
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


    @Get('/images/:imgpath')
    seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
        return res.sendFile(image, { root: './images/category' });
    }

}
