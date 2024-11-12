import { test } from '@japa/runner'
import Set from 'App/Models/Set'
import CategoryInSet from 'App/Models/CategoryInSet'
import User from 'App/Models/User'

test.group('Set creation', (group) => {
  let authUser

  group.setup(async () => {
    // Створюємо тестового користувача
    authUser = await User.create({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
      name: 'name',
      surname: 'surname'
    })
  })

  group.teardown(async () => {
    await authUser.delete()
    await Set.query().delete() // Видаляємо всі записи, створені під час тестування
    await CategoryInSet.query().delete()
  })

  test('create set successfully with up to 3 categories', async ({ client, assert }) => {
    const categories = [1, 2, 3]
    
    const response = await client
      .post('/sets')
      .loginAs(authUser) // Імітація аутентифікації користувача
      .json({
        name: 'Sample Set',
        access: 'public',
        level_id: 1,
        shared: true,
        categories,
      })

    response.assertStatus(201)
    response.assertBodyContains({ message: 'Set created successfully' })

    const createdSet = await Set.findBy('name', 'Sample Set')
    assert.isNotNull(createdSet, 'Set was not created in the database')

    const questionSetId = createdSet?.QuestionSet_id ?? 0; // або інше значення за замовчуванням

    const categoryLinks = await CategoryInSet.query().where('questionSetId', questionSetId)
    assert.equal(categoryLinks.length, 3, 'Incorrect number of categories linked to the set')
  })

  test('fail to create set with more than 3 categories', async ({ client }) => {
    const categories = [1, 2, 3, 4] // Перевищує ліміт у 3 категорії
    
    const response = await client
      .post('/sets')
      .loginAs(authUser) // Імітація аутентифікації користувача
      .json({
        name: 'Another Set',
        access: 'private',
        level_id: 2,
        shared: false,
        categories,
      })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Максимум 3 категорії можна додати до сету' })
  })
})
