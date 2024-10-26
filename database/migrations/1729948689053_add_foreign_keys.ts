import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddForeignKeys extends BaseSchema {
  public async up() {
    this.schema.alterTable('friends', (table) => {
      table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE')
      table.foreign('friend_user_id').references('user_id').inTable('users').onDelete('CASCADE')
      table.foreign('status_id').references('status_id').inTable('statuses').onDelete('SET NULL')
    })

    this.schema.alterTable('feedback', (table) => {
      table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE')
    })

    this.schema.alterTable('folders', (table) => {
      table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE')
    })

    this.schema.alterTable('awards', (table) => {
      table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE')
      table.foreign('type_id').references('typeAward_id').inTable('types_awards').onDelete('CASCADE')
    })

    this.schema.alterTable('sets', (table) => {
      table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE')
      table.foreign('level_id').references('level_id').inTable('levels').onDelete('SET NULL')
    })

    this.schema.alterTable('resources_likes', (table) => {
      table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE')
      table.foreign('resource_id').references('resources_id').inTable('resources').onDelete('CASCADE')
    })

    this.schema.alterTable('resources', (table) => {
      table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE')
      table.foreign('level_id').references('level_id').inTable('levels').onDelete('SET NULL')
    })

    this.schema.alterTable('subscriptions', (table) => {
      table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE')
      table.foreign('type_id').references('subscriptions_type_id').inTable('subscriptions_types').onDelete('CASCADE')
    })

    this.schema.alterTable('date_of_visit', (table) => {
      table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE')
    })

    this.schema.alterTable('complaint', (table) => {
      table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE')
      table.foreign('user_id_compl').references('user_id').inTable('users').onDelete('CASCADE')
      table.foreign('resources_id').references('resources_id').inTable('resources').onDelete('CASCADE')
      table.foreign('set_id').references('QuestionSet_id').inTable('sets').onDelete('CASCADE')
    })

    this.schema.alterTable('favourite', (table) => {
      table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE')
      table.foreign('question_list_id').references('QuestionSet_id').inTable('sets').onDelete('CASCADE')
      table.foreign('folder_id').references('folder_id').inTable('folders').onDelete('CASCADE')
      table.foreign('resource_id').references('resources_id').inTable('resources').onDelete('CASCADE')
    })

    this.schema.alterTable('questions', (table) => {
      table.foreign('list_id').references('QuestionSet_id').inTable('sets').onDelete('CASCADE')
    })

    this.schema.alterTable('set_in_folder', (table) => {
      table.foreign('set_id').references('QuestionSet_id').inTable('sets').onDelete('CASCADE')
      table.foreign('folder_id').references('folder_id').inTable('folders').onDelete('CASCADE')
    })

    this.schema.alterTable('category_in_set', (table) => {
      table.foreign('question_set_id').references('QuestionSet_id').inTable('sets').onDelete('CASCADE')
      table.foreign('category_id').references('category_id').inTable('categories').onDelete('CASCADE')
    })

    this.schema.alterTable('shared_sets', (table) => {
      table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE')
      table.foreign('set_id').references('QuestionSet_id').inTable('sets').onDelete('CASCADE')
    })

    this.schema.alterTable('help_answers', (table) => {
      table.foreign('friend_id').references('friend_id').inTable('friends').onDelete('CASCADE')
      table.foreign('question_id').references('question_id').inTable('questions').onDelete('CASCADE')
    })

    this.schema.alterTable('request_for_help', (table) => {
      table.foreign('friend_id').references('friend_id').inTable('friends').onDelete('CASCADE')
      table.foreign('question_id').references('question_id').inTable('questions').onDelete('CASCADE')
    })
  }

  public async down() {
    // Вказати видалення зв'язків для кожної таблиці
    this.schema.alterTable('friends', (table) => {
      table.dropForeign(['user_id', 'friend_user_id', 'status_id'])
    })
    this.schema.alterTable('feedbacks', (table) => {
      table.dropForeign(['user_id'])
    })
    this.schema.alterTable('folders', (table) => {
      table.dropForeign(['user_id'])
    })
    this.schema.alterTable('awards', (table) => {
      table.dropForeign(['user_id', 'type_id'])
    })
    this.schema.alterTable('sets', (table) => {
      table.dropForeign(['user_id', 'level_id'])
    })
    this.schema.alterTable('resources_likes', (table) => {
      table.dropForeign(['user_id', 'resource_id'])
    })
    this.schema.alterTable('resources', (table) => {
      table.dropForeign(['user_id', 'level_id'])
    })
    this.schema.alterTable('subscriptions', (table) => {
      table.dropForeign(['user_id', 'type_id'])
    })
    this.schema.alterTable('date_of_visits', (table) => {
      table.dropForeign(['user_id'])
    })
    this.schema.alterTable('complaints', (table) => {
      table.dropForeign(['user_id', 'user_id_compl', 'resources_id', 'set_id'])
    })
    this.schema.alterTable('favourites', (table) => {
      table.dropForeign(['user_id', 'question_list_id', 'folder_id', 'resource_id'])
    })
    this.schema.alterTable('questions', (table) => {
      table.dropForeign(['list_id'])
    })
    this.schema.alterTable('set_in_folders', (table) => {
      table.dropForeign(['set_id', 'folder_id'])
    })
    this.schema.alterTable('category_in_sets', (table) => {
      table.dropForeign(['question_set_id', 'category_id'])
    })
    this.schema.alterTable('shared_sets', (table) => {
      table.dropForeign(['user_id', 'set_id'])
    })
    this.schema.alterTable('help_answers', (table) => {
      table.dropForeign(['friend_id', 'question_id'])
    })
    this.schema.alterTable('request_for_helps', (table) => {
      table.dropForeign(['friend_id', 'question_id'])
    })
  }
}
