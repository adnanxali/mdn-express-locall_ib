const Author= require('../models/author');
const Book=require('../models/book');
const asyncHandler = require('express-async-handler');
const {body,validationResult}= require('express-validator');

exports.author_list = asyncHandler(async (req, res, next) => {
    const allAuthors = await Author.find().sort({ family_name: 1 }).exec();
    res.render("author_list", {
      title: "Author List",
      author_list: allAuthors,
    });
  });
exports.author_details=asyncHandler(async(req,res,next)=>{
    const [author,allBooksByAuthor]= await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author:req.params.id},"title Summary").exec()
    ])
    if(author===null){
        const err=new Error("Author Not Found");
        err.status(404);
        return next(err);
    }
    res.render("author_detail",{
        title:"Author Details",
        author:author,
        author_books:allBooksByAuthor
    })
});
exports.author_create_get=asyncHandler(async(req,res,next)=>{
    res.render("author_form",{
        title:"Create Author"
    })
});
exports.author_create_post=[
    body("first_name")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("First Name must be specified")
    .isAlphanumeric()
    .withMessage("First Name is not a alpha-numeric"),

    body("family_name")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("Family Name is required")
    .isAlphanumeric()
    .withMessage("Family Name is not a alpha-numeric"),

    body("date_of_birth","Invalid Date")
    .optional({values:"falsy"})
    .isISO8601()
    .toDate(),
    body("date_of_death","Invalid Date")
    .optional({values:"falsy"})
    .isISO8601()
    .toDate(),

    asyncHandler (async (req,res,next)=>{

        const errors= validationResult(req);
        
        const author = new Author({
            first_name:req.body.first_name,
            family_name:req.body.family_name,
            date_of_birth:req.body.date_of_birth,
            date_of_death:req.body.date_of_death
        });

        if(!errors.isEmpty()){
            res.render("author_form",{
                title:"Create Author",
                author:author,
                errors:errors.array()
            })
            return;
        }else{
            await author.save()
            res.redirect(author.url)
        }

    })
];
exports.author_delete_get=asyncHandler(async(req,res,next)=>{
    const[author,allBooksByAuthor]=await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author:req.params.id},"title summary").exec()
    ])

    if(author===null){
        res.redirect("/catalog/authors");
    }

    res.render("author_delete",{
        title:"Delete Author",
        author:author,
        author_books:allBooksByAuthor
    })

});
exports.author_delete_post=asyncHandler(async(req,res,next)=>{
    const[author,allBooksByAuthor]=await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author:req.params.id},"title summary").exec()
    ]);
    if(allBooksByAuthor.length>0){
        res.render("author_delete",{
            title:"Delete Author",
            author:author,
            author_books:allBooksByAuthor
        })
    }else{
        await Author.findByIdAndRemove(req.params.id);
        res.redirect("/catalog/authors");
    }
});
exports.author_update_get = asyncHandler(async (req, res, next) => {
    const author = await Author.findById(req.params.id).exec();
    if (author === null) {
      
      const err = new Error("Author not found");
      err.status = 404;
      return next(err);
    }
  
    res.render("author_form", { title: "Update Author", author: author });
  });
exports.author_update_post=[

    body("first_name")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("First Name is Required")
    .isAlphanumeric()
    .withMessage("First Name is not AlphaNumeric"),

    body("family_name")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("Family Name is Required")
    .isAlphanumeric()
    .withMessage("Family Name is not AlphaNumeric"),

    body("date_of_birth","Invalid Date")
    .optional({values:"falsy"})
    .isISO8601()
    .toDate(),

    body("date_of_death","Invalid Date")
    .optional({values:"falsy"})
    .isISO8601()
    .toDate(),

    asyncHandler(async(req,res,next)=>{
        const errors= validationResult(req);

        const author= new Author({
            first_name:req.body.first_name,
            family_name:req.body.family_name,
            date_of_birth:req.body.date_of_birth,
            date_of_death:req.body.date_of_death,
            _id: req.params.id
        })

        if(!errors.isEmpty()){
            const author = await Author.findById(req.params.id).exec();
            res.render("author_form",{
                author:author,
                errors:errors.array()
            })
        }else{
            const updateAuthor= await Author.findByIdAndUpdate(req.params.id,author,{});
            res.redirect(updateAuthor.url);
        }

    })

];