const express = require('express');
const router = express.Router();
const Post = require('../models/Post')

router.get('', async (req, res) => {
    try {
        const locals = {
            title: "Node.js Project",
            description: "Blog website with node.js"
        }


        let perPage = 6;
        let page = req.query.page || 1;
        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }]).skip(perPage * page - perPage).limit(perPage).exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', { locals, data, current: page, nextPage: hasNextPage ? nextPage : null });
    } catch (error) {
        console.log(error)
    }


});


router.get('/post/:id', async (req, res) => {
    try {
        const locals = {
            title: "Node.js Project",
            description: "Blog website with node.js"
        }

        let slug = req.params.id

        const data = await Post.findById({ _id: slug })
        res.render('post', { locals, data })
    } catch (error) {
        console.log(error)
    }
})



router.get('/about', (req, res) => {
    res.render('about')
});



router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Blog website with node.js"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        })



        res.render('search', { data, locals })
    } catch (error) {
        console.log(error)
    }
})



//basic get function

// router.get('', async (req, res) => {
//     const locals = {
//         title: "Node.js blog",
//         description: "Simple blog project using node.js"
//     }

//     try {
//         const data = await Post.find();
//         res.render('index', {locals, data})
//     } catch (error) {
//         console.log(error)
//     }

// });


// Function for inserting data into the database

// function insertPostData(){
//     Post.insertMany([
//         {
//             title: "My first Blog",
//             body: "This is my first blog ever"
//         },
//         {
//             title: "My first Blog",
//             body: "This is my first blog ever"
//         },
//         {
//             title: "My first Blog",
//             body: "This is my first blog ever"
//         },
//         {
//             title: "My first Blog",
//             body: "This is my first blog ever"
//         },
//         {
//             title: "My first Blog",
//             body: "This is my first blog ever"
//         }

//     ])
// }


// insertPostData();



module.exports = router;