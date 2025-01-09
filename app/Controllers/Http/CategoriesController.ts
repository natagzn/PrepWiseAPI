import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Category from 'App/Models/Category';
import Set from 'App/Models/Set';
import CategoryInSet from 'App/Models/CategoryInSet';

//first commit 


export default class CategoriesController {
  
  /**
   * @swagger
   * /api/categories:
   *   post:
   *     summary: Create a new category
   *     tags: [Categories]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Technology"
   *     responses:
   *       201:
   *         description: Category created successfully
   *       500:
   *         description: Failed to create category
   */
  public async create({ request, response }: HttpContextContract) {
    try {
      const { name } = request.only(['name']);
      const category = await Category.create({ name });
      return response.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
      return response.status(500).json({ message: 'Failed to create category', error });
    }
  }

  /**
   * @swagger
   * /api/categories:
   *   get:
   *     summary: Retrieve all categories
   *     tags: [Categories]
   *     responses:
   *       200:
   *         description: Categories retrieved successfully
   *       500:
   *         description: Failed to retrieve categories
   */
  public async getCategories({ response }: HttpContextContract) {
    try {
      const categories = await Category.all();
      return response.status(200).json({ message: 'Categories retrieved successfully', categories });
    } catch (error) {
      return response.status(500).json({ message: 'Failed to retrieve categories', error });
    }
  }

  /**
   * @swagger
   * /api/categories/{id}:
   *   put:
   *     summary: Update a category
   *     tags: [Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The category ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Science"
   *     responses:
   *       200:
   *         description: Category updated successfully
   *       500:
   *         description: Failed to update category
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(params.id);
      category.name = request.input('name');
      await category.save();
      return response.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
      return response.status(500).json({ message: 'Failed to update category', error });
    }
  }

  /**
   * @swagger
   * /api/categories/{id}:
   *   delete:
   *     summary: Delete a category
   *     tags: [Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The category ID
   *     responses:
   *       200:
   *         description: Category deleted successfully
   *       500:
   *         description: Failed to delete category
   */
  public async delete({ params, response }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(params.id);
      await category.delete();
      return response.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      return response.status(500).json({ message: 'Failed to delete category', error });
    }
  }

  /**
   * @swagger
   * /api/sets/{setId}/categories/{categoryId}:
   *   post:
   *     summary: Add a category to a set
   *     tags: [Categories, Sets]
   *     parameters:
   *       - in: path
   *         name: setId
   *         required: true
   *         schema:
   *           type: integer
   *         description: The set ID
   *       - in: path
   *         name: categoryId
   *         required: true
   *         schema:
   *           type: integer
   *         description: The category ID
   *     responses:
   *       201:
   *         description: Category added to set successfully
   *       400:
   *         description: A set can only have up to 3 categories
   *       500:
   *         description: Failed to add category to set
   */
  public async addCategoryToSet({ params, response }: HttpContextContract) {
    try {
      const set = await Set.findOrFail(params.setId);
      const categoryId = params.categoryId;

      const categoriesCount = await CategoryInSet.query()
        .where('questionSetId', set.QuestionSet_id)
        .count('* as total');

      if (categoriesCount[0].$extras.total >= 3) {
        return response.status(400).json({ message: 'A set can only have up to 3 categories' });
      }

      const categoryInSet = await CategoryInSet.create({
        questionSetId: set.QuestionSet_id,
        categoryId: categoryId,
      });
      return response.status(201).json({ message: 'Category added to set successfully', categoryInSet });
    } catch (error) {
      return response.status(500).json({ message: 'Failed to add category to set', error });
    }
  }

  /**
   * @swagger
   * /api/sets/{setId}/categories/{categoryId}:
   *   delete:
   *     summary: Remove a category from a set
   *     tags: [Categories, Sets]
   *     parameters:
   *       - in: path
   *         name: setId
   *         required: true
   *         schema:
   *           type: integer
   *         description: The set ID
   *       - in: path
   *         name: categoryId
   *         required: true
   *         schema:
   *           type: integer
   *         description: The category ID
   *     responses:
   *       200:
   *         description: Category removed from set successfully
   *       500:
   *         description: Failed to remove category from set
   */
  public async removeCategoryFromSet({ params, response }: HttpContextContract) {
    try {
      const categoryInSet = await CategoryInSet.query()
        .where('questionSetId', params.setId)
        .andWhere('categoryId', params.categoryId)
        .firstOrFail();
      
      await categoryInSet.delete();
      return response.status(200).json({ message: 'Category removed from set successfully' });
    } catch (error) {
      return response.status(500).json({ message: 'Failed to remove category from set', error });
    }
  }
}
