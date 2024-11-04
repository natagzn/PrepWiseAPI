import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
  Route.post("/auth/login", "AuthController.login");
  Route.post("/auth/register", "AuthController.register");


  Route.group(()=>{
    Route.get("/user", "AuthController.getUser");
    Route.post("/auth/logout", "AuthController.logout");
    Route.get('/profile', 'UsersController.showProfile');
    Route.put('/change-password', 'UsersController.changePassword').middleware('auth')
    Route.post('/update', 'UsersController.updateProfile')

    Route.post('/feedback', 'FeedbacksController.store')
  }).middleware("auth:api");
}).prefix("/api");

Route.group(() => {
Route.group(() => {
  Route.get('/levels', 'LevelsController.index')
  Route.get('/levels/:id', 'LevelsController.show')
  Route.put('/levels/:id', 'LevelsController.update')
  Route.delete('/levels/:id', 'LevelsController.delete')
}).middleware("auth:api")
}).prefix("/api");
Route.post('/levels', 'LevelsController.create')


Route.group(() => {
  Route.group(() => {
    Route.get('/questions', 'QuestionsController.index')
    Route.post('/questions', 'QuestionsController.create')
    Route.get('/questions/:id', 'QuestionsController.show')
    Route.put('/questions/:id', 'QuestionsController.update')
    Route.delete('/questions/:id', 'QuestionsController.delete')    

  }).middleware("auth:api")
  }).prefix("/api");

  Route.group(() => {
    Route.group(() => {
      Route.get('/sets', 'SetsController.index')
      Route.post('/sets', 'SetsController.create')
      Route.put('/sets/:id', 'SetsController.update')
      Route.delete('/sets/:id', 'SetsController.delete')  
      Route.get('/setsAll', 'SetsController.getUserSetsWithQuestions')  

    }).middleware("auth:api")
    }).prefix("/api");

    Route.group(() => {
      Route.group(() => {
        Route.get('/friends', 'PeopleController.getFriends')
        Route.get('/following', 'PeopleController.getAddedUserIds')
        Route.get('/subscribers', 'PeopleController.getSubscribers')
        Route.post('/addFriend', 'PeopleController.addFriend')
        Route.delete('/friends/delete/:id', 'PeopleController.deleteFriend')

      }).middleware("auth:api")
      }).prefix("/api");

      Route.group(() => {
        Route.group(() => {
          Route.get('/folders', 'FoldersController.index')
          Route.get('/folders/:id', 'FoldersController.show')
          Route.post('/folders', 'FoldersController.create')
          Route.put('/folders/:id', 'FoldersController.update')
          Route.delete('/folders/:id', 'FoldersController.delete')

          Route.post('/folders/:id/add-set', 'FoldersController.addSetToFolder')
          Route.get('/folders-with-all', 'FoldersController.getUserFoldersWithSetsAndQuestions')

        }).middleware("auth:api")
        }).prefix("/api");


      Route.group(() => {
        Route.group(() => {
          Route.post('/categories', 'CategoriesController.create')          
          Route.get('/categories', 'CategoriesController.getCategories')            
          Route.put('/categories/:id', 'CategoriesController.update')       
          Route.delete('/categories/:id', 'CategoriesController.delete') 
  
          Route.post('/sets/:setId/categories/:categoryId', 'CategoriesController.addCategoryToSet') 
          Route.delete('/sets/:setId/categories/:categoryId', 'CategoriesController.removeCategoryFromSet') 
        }).middleware("auth:api")
        }).prefix("/api");

        Route.group(() => {
          Route.group(() => {
            Route.post('/resources', 'ResourcesController.create')         
            Route.get('/resources', 'ResourcesController.index')           // Отримання всіх ресурсів
            Route.get('/resources/:id', 'ResourcesController.show')        // Отримання конкретного ресурсу
            Route.put('/resources/:id', 'ResourcesController.update')      // Оновлення ресурсу
            Route.delete('/resources/:id', 'ResourcesController.delete')
          }).middleware("auth:api")
          }).prefix("/api");

Route.group(() => {
  Route.group(() => {
    Route.post('/favourites/set', 'FavouritesController.addSetToFavourites')
    Route.delete('/favourites/set', 'FavouritesController.removeSetFromFavourites')

    Route.post('/favourites/folder', 'FavouritesController.addFolderToFavourites')
    Route.delete('/favourites/folder', 'FavouritesController.removeFolderFromFavourites')

    Route.post('/favourites/resource', 'FavouritesController.addResourceToFavourites')
    Route.delete('/favourites/resource', 'FavouritesController.removeResourceFromFavourites')
    
    Route.get('/favourites', 'FavouritesController.getFavourites')
  }).middleware("auth:api")
  }).prefix("/api");

  Route.group(() => {
    Route.group(() => {
      Route.post('/resources-likes', 'ResourcesLikesController.create');
      Route.get('/resources-likes/:resourceId', 'ResourcesLikesController.index');
      Route.put('/resources-likes/:resourceId', 'ResourcesLikesController.update');
      Route.delete('/resources-likes/:resourceId', 'ResourcesLikesController.destroy');
    }).middleware("auth:api")
    }).prefix("/api");

    Route.group(() => {
      Route.group(() => {
        Route.post('/complaints', 'ComplaintsController.create')
        Route.get('/complaints', 'ComplaintsController.index')
        Route.get('/complaints/:id', 'ComplaintsController.show')
        Route.put('/complaints/:id', 'ComplaintsController.update')
        Route.delete('/complaints/:id', 'ComplaintsController.delete')
      }).middleware("auth:api")
      }).prefix("/api");

      Route.group(() => {
        Route.group(() => {
          Route.get('shared-sets', 'SharedSetsController.index') 
          Route.post('shared-sets', 'SharedSetsController.create')
          Route.get('shared-sets/:id', 'SharedSetsController.show') 
          Route.put('shared-sets/:id', 'SharedSetsController.update') 
          Route.delete('shared-sets/:id', 'SharedSetsController.destroy') 
          
          Route.get('shared-sets/:id/author', 'SharedSetsController.getAuthorId')
        }).middleware("auth:api")
        }).prefix("/api");

Route.group(() => {
Route.group(() => {
  Route.post('/request-for-help', 'RequestForHelpsController.create')
  Route.post('/help-answers', 'HelpAnswersController.create')
  Route.get('/help-answers/:id', 'HelpAnswersController.show')

}).middleware("auth:api")
}).prefix("/api");




