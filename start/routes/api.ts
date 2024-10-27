import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
  Route.post("/auth/login", "AuthController.login");
  Route.post("/auth/register", "AuthController.register");


  Route.group(()=>{
    Route.get("/user", "AuthController.getUser");
    Route.post("/auth/logout", "AuthController.logout");
    Route.get('/profile', 'UsersController.showProfile');
  }).middleware("auth:api");

}).prefix("/api");