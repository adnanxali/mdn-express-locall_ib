const express =require("express");
const router= express.Router();

const book_controller= require('../Controllers/bookController');
const author_controller= require('../Controllers/authorController');
const bookinstance_controller= require('../Controllers/bookinstanceController');
const genre_controller= require('../Controllers/genreController');

//book controller
router.get('/',book_controller.index);
//book create
router.get('/book/create',book_controller.book_create_get);
router.post('/book/create',book_controller.book_create_post);
//book delete
router.get('/book/:id/delete',book_controller.book_delete_get);
router.post('/book/:id/delete',book_controller.book_delete_post);
//update
router.get('/book/:id/update',book_controller.book_update_get);
router.post('/book/:id/update',book_controller.book_update_post);
//request for 1 book
router.get('/book/:id',book_controller.book_detail);
//show book list
router.get('/books',book_controller.book_list);
router.get("/author/create", author_controller.author_create_get);

// POST request for creating Author.
router.post("/author/create", author_controller.author_create_post);

// GET request to delete Author.
router.get("/author/:id/delete", author_controller.author_delete_get);

// POST request to delete Author.
router.post("/author/:id/delete", author_controller.author_delete_post);

// GET request to update Author.
router.get("/author/:id/update", author_controller.author_update_get);

// POST request to update Author.
router.post("/author/:id/update", author_controller.author_update_post);

// GET request for one Author.
router.get("/author/:id", author_controller.author_details);

// GET request for list of all Authors.
router.get("/authors", author_controller.author_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genre_controller.genre_create_get);

//POST request for creating Genre.
router.post("/genre/create", genre_controller.genre_create_post);

// GET request to delete Genre.
router.get("/genre/:id/delete", genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET request to update Genre.
router.get("/genre/:id/update", genre_controller.genre_update_get);

// POST request to update Genre.
router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET request for one Genre.
router.get("/genre/:id", genre_controller.genre_detail);

// GET request for list of all Genre.
router.get("/genres", genre_controller.genre_list);

//BOOK INSTANCES

router.get(
    "/bookinstance/create",
    bookinstance_controller.bookinstance_create_get,
  );
  
  // POST request for creating BookInstance.
  router.post(
    "/bookinstance/create",
    bookinstance_controller.bookinstance_create_post,
  );
  
  // GET request to delete BookInstance.
  router.get(
    "/bookinstance/:id/delete",
    bookinstance_controller.bookinstance_delete_get,
  );
  
  // POST request to delete BookInstance.
  router.post(
    "/bookinstance/:id/delete",
    bookinstance_controller.bookinstance_delete_post,
  );
  
  // GET request to update BookInstance.
  router.get(
    "/bookinstance/:id/update",
    bookinstance_controller.bookinstance_update_get,
  );
  
  // POST request to update BookInstance.
  router.post(
    "/bookinstance/:id/update",
    bookinstance_controller.bookinstance_update_post,
  );
  
  // GET request for one BookInstance.
  router.get("/bookinstance/:id", bookinstance_controller.bookinstance_detail);
  
  // GET request for list of all BookInstance.
  router.get("/bookinstances", bookinstance_controller.bookinstance_list);

  module.exports=router;
