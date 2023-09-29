const Genre = require("../models/genre");
const Book=require('../models/book');
const asyncHandler = require("express-async-handler");
const {body,validationResult}= require("express-validator");


// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenre=await Genre.find().sort({name:1}).exec();
  res.render("genre_list",{
    title:"Genre",
    genre_list: allGenre,
  })
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  // Get details of genre and all associated books (in parallel)
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);
  if (genre === null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Genre Detail",
    genre: genre,
    genre_books: booksInGenre,
  });
});

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form",{title:"Create Genre"});
};

// Handle Genre create on POST.
exports.genre_create_post = [
  body("name","Genre Should contains atleast 3 charaters")
  .trim()
  .isLength({min:3})
  .escape(),

  //Request/Response Handler

  asyncHandler (async(req,res,next)=>{

    const errors=validationResult(req);

    const genre= new Genre({name:req.body.name});

    if(!errors.isEmpty()){
// if form has errors it will be redisplayed with validators/ sanitization

      res.render("genre_form",{
        title:"Create Genre",
        genre:genre,
        errors:errors.array()
      });

    }
    else{
      //Data is valid in the from, now will check if the genre exist or not
      const genreExist= await Genre.findOne({name:req.body.name}).collation({locale:"en",strength:2}).exec();
      if(genreExist){
        res.redirect(genreExist.url)
      }else{
        await genre.save();
        res.redirect(genre.url);
      }

    }


  }),


];

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const [genre,allBooksinGenre]=await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({genre:req.params.id}).exec()
  ]);
  if(genre===null){
    res.redirect('/catalog/genres');
  }else{
    res.render("genre_delete",{
      title:"Delete Genre",
      genre:genre,
      genre_books:allBooksinGenre,
    })
  }
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const [genre,allBooksinGenre]=await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({genre:req.params.id}).exec()
  ]);
  if(allBooksinGenre.length>0){
    res.render("genre_delete",{
      title:"Delete Genre",
      genre:genre,
      genre_books:allBooksinGenre,
    })
  }else{
    await Genre.findByIdAndRemove(req.params.id);
    res.redirect('/catalog/genres');
  }
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  const genre= await Genre.findById(req.params.id);

  if(genre===null){
    const err= new Error("Genre not found");
    err.status(404);
    return next(err);
  }
  res.render("genre_form",{
    title:"Update Genre",
    genre:genre
  })

});

// Handle Genre update on POST.
exports.genre_update_post = [
  body("name","Genre Should be entered")
  .trim()
  .isLength({min:1})
  .escape(),

  asyncHandler(async(req,res,next)=>{
    const errors = validationResult(req);

    const genre= new Genre({
      name:req.body.name,
      _id:req.params.id
    })

    if(!errors.isEmpty()){

      const genre= await Genre.findById(req.params.id);
      res.render("genre_form",{
        title:"Update Genre",
        genre:genre,
        errors:errors.array()
      })

    }else{
      const updateGenre= await Genre.findByIdAndUpdate(req.params.id,genre,{});
      res.redirect(updateGenre.url);
    }

  })

]
