import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import Set from 'App/Models/Set'
import CategoryInSet from 'App/Models/CategoryInSet'

export default class CategoriesController {
  
  // Create a new category
  public async create({ request, response }: HttpContextContract) {
    try {
      const { name } = request.only(['name'])
      const category = await Category.create({ name })
      return response.status(201).json({ message: 'Category created successfully', category })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to create category', error })
    }
  }

  public async getCategories({ response }: HttpContextContract) {
    try {
      const categories = await Category.all()
      return response.status(200).json({ message: 'Categories retrieved successfully', categories })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to retrieve categories', error })
    }
  }

  // Update a category
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(params.id)
      category.name = request.input('name')
      await category.save()
      return response.status(200).json({ message: 'Category updated successfully', category })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to update category', error })
    }
  }

  // Delete a category
  public async delete({ params, response }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.delete()
      return response.status(200).json({ message: 'Category deleted successfully' })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to delete category', error })
    }
  }

  // Add category to set (with max 3 categories per set)
  public async addCategoryToSet({ params, response }: HttpContextContract) {
    try {
      const set = await Set.findOrFail(params.setId)
      const categoryId = params.categoryId

      // Check if the set already has 3 categories
      const categoriesCount = await CategoryInSet.query()
        .where('questionSetId', set.QuestionSet_id)
        .count('* as total')

      if (categoriesCount[0].$extras.total >= 3) {
        return response.status(400).json({ message: 'A set can only have up to 3 categories' })
      }

      // Add category to set
      const categoryInSet = await CategoryInSet.create({
        questionSetId: set.QuestionSet_id,
        categoryId: categoryId,
      })
      return response.status(201).json({ message: 'Category added to set successfully', categoryInSet })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to add category to set', error })
    }
  }

  // Remove category from set
  public async removeCategoryFromSet({ params, response }: HttpContextContract) {
    try {
      const categoryInSet = await CategoryInSet.query()
        .where('questionSetId', params.setId)
        .andWhere('categoryId', params.categoryId)
        .firstOrFail()
      
      await categoryInSet.delete()
      return response.status(200).json({ message: 'Category removed from set successfully' })
    } catch (error) {
      return response.status(500).json({ message: 'Failed to remove category from set', error })
    }
  }
}
