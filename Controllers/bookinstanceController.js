const expressAsyncHandler = require('express-async-handler');
const Book =require('../models/book');
const BookInstance = require("../models/bookInstance")
const asyncHandler = require("express-async-handler");
const {body,validationResult}= require('express-validator');

// Display list of all BookInstances.
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  const allBookInstances = await BookInstance.find(req.params.id).populate("book").exec();

  res.render("bookinstance_list", {
    title: "Book Instance List",
    bookinstance_list: allBookInstances,
});
});

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();

  if (bookInstance === null) {
    // No results.
    const err = new Error("Book copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("bookinstances_detail", {
    title: "Book:",
    bookinstance: bookInstance,
  });
});

// Display BookInstance create form on GET.
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
  const allBooks= await Book.find({},"title").exec();

  res.render("bookinstance_form",{
    title:"Create Book Instance",
    book_list:allBooks
  })
});

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  body("book","Book Name must be specified").trim().isLength({min:1}).escape(),
  body("status","Book Status must be specified").trim().isLength({min:1}).escape(),
  body("due_back","Invalid Date").optional({values:"falsy"}).isISO8601().toDate(),

  expressAsyncHandler(async(req,res,next)=>{
    const allBooks= await Book.find({},"title").exec();

    const errors=validationResult(req);

    const bookInstance= new BookInstance({
      book:req.body.book,
      imprint:req.body.imprint,
      status:req.body.status,
      due_back:req.body.due_back
    });
    if(!errors.isEmpty()){

      res.render("bookinstance_form",{
        title:"Create Book Instance",
        book_list:allBooks,
        selected_books:bookInstance.book._id,
        errors:errors.array(),
        bookinstance:bookInstance
      });
      return;

    }else{

      await bookInstance.save();
      res.redirect(bookInstance.url);

    }

  })

]

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  const bookinstance=await BookInstance.findById(req.params.id).exec();
  if(bookinstance===null){
    res.redirect('/catalog/bookinstances');
  }else{
    res.render('bookinstance_delete',{
      title:"Delete Book Instance",
      bookinstance:bookinstance
    })
  }
});

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  await BookInstance.findByIdAndRemove(req.params.id);
  res.redirect('/catalog/bookinstances');
});

// Display BookInstance update form on GET.
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
  const [books,bookinstance]= await Promise.all([
    Book.find().exec(),
    BookInstance.findById(req.params.id).populate("book").exec(),
  ])
  if(bookinstance===null){
    const err= new Error("Instance Not Found");
    err.status(404);
    return next(err);
  }
  res.render("bookinstance_form",{
    title:"Update Book Instance",
    book_list:books,
    bookinstance:bookinstance
  })

});

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
  body("book","Book must be selected")
  .trim()
  .isLength({min:1})
  .escape(),

  body("imprint","This must not be empty")
  .trim()
  .isLength({min:5})
  .escape(),

  body("due_back","Invalid Date")
  .optional({values:"falsy"})
  .isISO8601()
  .toDate(),

  asyncHandler(async (req,res,next)=>{

    const errors= validationResult(req);

    const bookinstance= new BookInstance({
      book:req.body.book,
      imprint:req.body.imprint,
      status:req.body.status,
      due_back:req.body.due_back,
      _id:req.params.id
    })

    if(!errors.isEmpty()){
      const [books,bookinstance]= await Promise.all([
        Book.find({},"title").exec(),
        BookInstance.findById(req.params.id).populate("book").exec(),
      ])
      res.render("bookinstance_form",{
        title:"Update Book Instance",
        book_list:books,
        bookinstance:bookinstance,
        errors:errors.array()
      })
    }else{
      const updateBookinstance= await BookInstance.findByIdAndUpdate(req.params.id,bookinstance,{});
      res.redirect(updateBookinstance.url);
    }

  })
];
