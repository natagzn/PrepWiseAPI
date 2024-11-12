import Route from '@ioc:Adonis/Core/Route'




Route.group(()=>{
  Route.post("/auth/login", "AuthController.login");
  Route.post("/auth/register", "AuthController.register");

  Route.post("/auth/send-code-register", "UsersController.sendConfirmEmail");
  Route.post("/auth/check-code", "UsersController.confirmationEmail");

  Route.post("/reset-password", "UsersController.sendResetPasswordEmail");
  Route.post("/check-reset-code", "UsersController.resetPassword");


Route.group(()=>{
  Route.get("/user", "AuthController.getUser");
  Route.post("/auth/logout", "AuthController.logout");
  Route.get('/profile', 'UsersController.showProfile');
  Route.put('/change-password', 'UsersController.changePassword').middleware('auth')
  Route.post('/update', 'UsersController.updateProfile')

  Route.get('/random', 'UsersController.getRandomSetsAndResources')
  Route.get('/search/:id', 'UsersController.getUserInfoForSearch')
  Route.get('/another-profile/:id', 'UsersController.getUserInfoWithRelations')


  Route.post('/feedback', 'FeedbacksController.store')
  Route.get('/feedback', 'FeedbacksController.index')

  }).middleware("auth:api");
}).prefix("/api");

Route.group(() => {
Route.group(() => {
  Route.get('/levels', 'LevelsController.index')
  Route.get('/levels/:id', 'LevelsController.show')
  Route.put('/levels/:id', 'LevelsController.update')
  Route.delete('/levels/:id', 'LevelsController.delete')
  Route.post('/levels', 'LevelsController.create')

}).middleware("auth:api")
}).prefix("/api");




Route.group(() => {
  Route.group(() => {
    Route.get('/questions', 'QuestionsController.index')
    Route.post('/questions', 'QuestionsController.create')
    Route.get('/questions/:id', 'QuestionsController.show')
    Route.put('/questions/:id', 'QuestionsController.update')
    Route.delete('/questions/:id', 'QuestionsController.delete')  
    
    Route.get('/questions-export-word/:path/:setId', 'QuestionsController.exportSetToWord')  
    Route.get('/questions-export-excel', 'QuestionsController.exportToExcel')  


  }).middleware("auth:api")
}).prefix("/api");

Route.group(() => {
  Route.group(() => {
    Route.post('/sets', 'SetsController.create')
    Route.get('/sets/:id', 'SetsController.show')
    Route.put('/sets/:id', 'SetsController.update')
    Route.delete('/sets/:id', 'SetsController.delete')  
    Route.get('/setsAll', 'SetsController.getUserSetsWithQuestions')  

    Route.delete('/sets-admin/:id', 'SetsController.deleteAdmin')  

  }).middleware("auth:api")
}).prefix("/api");

Route.group(() => {
  Route.group(() => {
    Route.get('/friends', 'PeopleController.getFriends')
    Route.get('/following', 'PeopleController.getAddedUserIds')
    Route.get('/subscribers', 'PeopleController.getSubscribers')
    Route.post('/people', 'PeopleController.addFriend')
    Route.delete('/people/delete/:id', 'PeopleController.deleteFriend')

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
    Route.delete('/folders-set', 'FoldersController.removeSetFromFolder')

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
    Route.get('/resources', 'ResourcesController.index')           
    Route.get('/resources/:id', 'ResourcesController.show')        
    Route.put('/resources/:id', 'ResourcesController.update')      
    Route.delete('/resources/:id', 'ResourcesController.delete')


  }).middleware("auth:api")

  Route.delete('/resources-admin/:id', 'ResourcesController.deleteAdmin')

}).prefix("/api");

Route.group(() => {
  Route.group(() => {
    Route.post('/favorites/set', 'FavoritesController.addSetToFavourites')
    Route.delete('/favorites/set', 'FavoritesController.removeSetFromFavourites')

    Route.post('/favorites/folder', 'FavoritesController.addFolderToFavourites')
    Route.delete('/favorites/folder', 'FavoritesController.removeFolderFromFavourites')

    Route.post('/favorites/resource', 'FavoritesController.addResourceToFavourites')
    Route.delete('/favorites/resource', 'FavoritesController.removeResourceFromFavourites')
    
    Route.get('/favorites', 'FavoritesController.getFavourites')
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

    Route.get('shared-sets-all', 'SharedSetsController.getSharedSets') 
    Route.get('shared-sets-by-user', 'SharedSetsController.getSetsSharedByCurrentUser') 
    Route.get('shared-sets-author/:id', 'SharedSetsController.checkUserAccess') 

    Route.get('shared-sets/:id/author', 'SharedSetsController.getAuthorId')
  }).middleware("auth:api")
}).prefix("/api");

Route.group(() => {
  Route.group(() => {
    Route.post('/request-for-help', 'RequestForHelpsController.create')
    Route.get('/request-for-help/:id', 'RequestForHelpsController.get')


    Route.post('/help-answers', 'HelpAnswersController.create')
    Route.get('/help-answers-for-questions/:id', 'HelpAnswersController.show')

    Route.get('/help-answers/:id', 'HelpAnswersController.get')

  }).middleware("auth:api")
}).prefix("/api");


Route.group(() => {
  Route.group(() => {
    Route.get('/help-requests', 'NotificationsController.getHelpRequests')
    Route.get('/help-answers', 'NotificationsController.getHelpAnswers')
    Route.post('/notifications', 'NotificationsController.create')

    Route.get('/notifications-user', 'NotificationsController.getUserNotifications')
  }).middleware("auth:api")
}).prefix("/api");

Route.group(() => {
  Route.group(() => {
    Route.get('/types_notifications', 'TypesNotificationsController.index')
    Route.post('/types_notifications', 'TypesNotificationsController.create')
    Route.get('/types_notifications/:id', 'TypesNotificationsController.show')
    Route.put('/types_notifications/:id', 'TypesNotificationsController.update')
    Route.delete('/types_notifications/:id', 'TypesNotificationsController.destroy')
  }).middleware("auth:api")
}).prefix("/api");


Route.group(() => {
  Route.group(() => {
    Route.get('/date-of-visits', 'DateOfVisitsController.index')
    Route.post('/date-of-visits/create', 'DateOfVisitsController.create')
    Route.get('/date-of-visits/days', 'DateOfVisitsController.getCurrentMonthVisitDays')


    Route.get('/global-search', 'GlobalSearchesController.globalSearch')
  }).middleware("auth:api")
}).prefix("/api");



Route.group(() => {
  Route.group(() => {
    Route.post('/subscription-types', 'SubscriptionTypesController.create')
    Route.get('/subscription-types', 'SubscriptionTypesController.index')
    Route.get('/subscription-types/:id', 'SubscriptionTypesController.show')
    Route.put('/subscription-types/:id', 'SubscriptionTypesController.update')
    Route.delete('/subscription-types/:id', 'SubscriptionTypesController.delete')

    Route.post('/subscription', 'SubscriptionsController.create')
    Route.get('/subscription', 'SubscriptionsController.getUserSubscriptions')

  }).middleware("auth:api")
}).prefix("/api");


