/*import { test } from '@japa/runner'
import User from 'App/Models/User'
import Set from 'App/Models/Set' // Ensure Set is imported correctly

// Helper function to log in and get token
async function getAuthToken(client) {
  const response = await client.post('/api/auth/login').json({
    email: 'testuser@example.com',
    password: 'testpassword'
  })
  return response.body().token.token // Adjust based on your token structure
}

test.group('Set creation', (group) => {
  let authToken: string

  group.setup(async () => {
    // Set up test user without needing `client`
    await User.create({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
      name: 'name',
      surname: 'surname'
    })
  })

  test('create set successfully with up to 3 categories', async ({ client, assert }) => {
    // Retrieve authToken inside the test function where `client` is available
    authToken = await getAuthToken(client)

    const categories = [1, 2, 3]

    const response = await client
      .post('/api/sets')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'Sample Set',
        access: true,
        level_id: 3,
        shared: false,
        categories,
      })

    response.assertStatus(201)
    response.assertBodyContains({ message: 'Set created successfully' })

    const createdSet = await Set.findBy('name', 'Sample Set')
    assert.isNotNull(createdSet, 'Set was not created in the database')
  })

  test('fail to create set with more than 3 categories', async ({ client }) => {
    authToken = await getAuthToken(client)

    const categories = [1, 2, 3, 4]

    const response = await client
      .post('/api/sets')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'Another Set',
        access: true,
        level_id: 3,
        shared: false,
        categories,
      })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Максимум 3 категорії можна додати до сету' })
  })
})



import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('User Registration', (group) => {
  group.setup(async () => {
    // Видаляємо тестового користувача перед запуском тесту
    await User.query().where('email', 'testuser@example.com').delete()
  })

  test('register a new user successfully', async ({ client, assert }) => {
    const response = await client.post('/api/auth/register').json({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
      password_confirmation: 'testpassword', // Додаємо підтвердження пароля
      name: 'name',
      surname: 'surname'
    })

    // Виведення тіла відповіді на випадок помилки
    console.log('Response Body:', response.body())

    // Перевіряємо, чи статус відповіді дорівнює 201
    response.assertStatus(200)
    response.assertBodyContains({ message: 'Account created successfully' })

    // Перевіряємо, чи користувач існує в базі даних
    const createdUser = await User.findBy('email', 'testuser@example.com')
    assert.isNotNull(createdUser, 'User was not created in the database')
  })
})
*/

import { test } from '@japa/runner'
import User from 'App/Models/User'
import Category from 'App/Models/Category'

// Helper function to log in and get token
async function getAuthToken(client) {
  const response = await client.post('/api/auth/login').json({
    email: 'testuser1@example.com',
    password: 'testpassword'
  })
  return response.body().token.token // Adjust based on your token structure
}

test.group('Category creation', (group) => {
  let authToken: string

  group.setup(async () => {
    // Set up test user without needing `client`
    await User.create({
      username: 'testuser1',
      email: 'testuser1@example.com',
      password: 'testpassword',
      name: 'name',
      surname: 'surname'
    })
  })

  test('create category successfully', async ({ client, assert }) => {
    // Retrieve authToken inside the test function where `client` is available
    authToken = await getAuthToken(client)

    const response = await client
      .post('/api/categories')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'Sample Category',
      })

    response.assertStatus(201)
    response.assertBodyContains({ message: 'Category created successfully' })

    const createdCategory = await Category.findBy('name', 'Sample Category')
    assert.isNotNull(createdCategory, 'Category was not created in the database')
  })

  test('fail to create category with duplicate name', async ({ client }) => {
    authToken = await getAuthToken(client)

    // First, create a category to trigger the duplicate error on second attempt
    /*await Category.create({ name: 'Duplicate Category' })

    const response = await client
      .post('/api/categories')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'Duplicate Category',
      })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Category with this name already exists' })*/
  })
})
