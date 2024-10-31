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
  Route.post('/levels', 'LevelsController.create')
  Route.get('/levels', 'LevelsController.index')
  Route.get('/levels/:id', 'LevelsController.show')
  Route.put('/levels/:id', 'LevelsController.update')
  Route.delete('/levels/:id', 'LevelsController.delete')
}).middleware("auth:api")
}).prefix("/api");

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
      Route.get('/sets/:id', 'SetsController.show')
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