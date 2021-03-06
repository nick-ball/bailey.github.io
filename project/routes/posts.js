var express = require("express");
var router = express.Router();
var Post = require("../models/post");

// INDEX - show all posts
router.get("/", function(req, res){
	// Get all posts from DB
	Post.find({}, function(err, allPosts){
		if(err){
			console.log(err);
		} else {
			res.render("posts/index", {posts:allPosts, page: 'posts'});
		}
	});
});

//CREATE - add new post to DB
router.post("/", function(req, res){
  // get data from form and add to posts array
  var title = req.body.title;
  var image = req.body.image;
  var desc = req.body.description;
    var newPost = {title: title, image: image, description: desc};
    // Create a new post and save to DB
    Post.create(newPost, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to the specific posts' page -- need todo that
            // console.log(newlyCreated);
			req.flash("success", "Successfully Created!");
            res.redirect("/posts");
        }
    });
  });

// NEW - show form to create new post
router.get("/new", function(req, res){
	res.render("posts/new");
});

// SHOW - shows more info about one post
router.get("/:id", function(req, res){
	//find the post with provided ID
	Post.findById(req.params.id).exec(function(err, foundPost){
		if(err || !foundPost){
			req.flash("error", "Post Not Found");
			res.redirect("back");
		} else {
			//render show template with that post
			res.render("posts/show", {post: foundPost});
			
		}
	});
});

//EDIT post route
router.get("/:id/edit", function(req, res){
	Post.findById(req.params.id, function(err, foundPost){
		if(err){
			req.flash("error", "Post Not Found");
		} else {
			res.render("posts/edit", {post: foundPost});
		}
	});
});


// UPDATE post ROUTE
router.put("/:id", function(req, res){
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/posts/" + post._id);
        }
    });
  });

//DESTROY post route
router.delete("/:id", function(req, res){
	Post.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/posts");
		} else {
			req.flash("error", "Post Deleted");
			res.redirect("/posts");
		}
	});
});

module.exports = router;