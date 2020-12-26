import { Category } from "src/entity/category.entity"

export class CategoryResponse {
    success: boolean
    data: Category | Category[]
}