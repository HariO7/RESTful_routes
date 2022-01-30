var express= require('express'),
    methodOverride=require('method-override'),
    app=express(),
    bodyParser= require('body-parser'),
    mongoose= require('mongoose');

    require('dotenv').config()

//App config
mongoose.connect(process.env.database);

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"))
//mongoose congfig

var blogSchema= new mongoose.Schema({
    name:String,
    image:String,
    body:String,
    created:{type:Date, default:Date.now}
});

var Blog = mongoose.model('Blog',blogSchema);

// Index Route
app.get("/",function(req,res){
    res.redirect('/blogs')
});
// Create Route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs})
        }
    });
});

app.get("/blogs/new",function(req,res){
    res.render("new");
});

app.post("/blogs",function(req,res){
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new")
        }else{
            res.redirect("/blogs")
        }
    });
});

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs")
        }else{
            res.render("show",{blog:foundBlog});
        }
    })
});
//Edit route

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs")
        }else{
            res.render("edit",{blog:foundBlog})
        }
    });
});
//Update route
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err){
            res.redirect("/blogs")
        }else{
            res.redirect("/blogs/" + req.params.id)
        }
    });
});

//Delete route
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.send("An Error have occured please check your code")
        }else{
            res.redirect("/blogs");
        }
    });
});


app.listen(3000,function(){
    console.log("Connection Successful!!!");
});
