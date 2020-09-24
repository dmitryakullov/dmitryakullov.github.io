
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const multer  = require("multer");
const fs = require('fs'); 
const path = require('path');


// try {
//     mongoose.connect('mongodb://localhost/project', {useNewUrlParser: true});
// } catch (error) {
//     handleError(error);
// }


                
try {
    mongoose.connect('mongodb+srv://dimaggio224xz:224225226227@cluster0.lbam2.mongodb.net/project?retryWrites=true&w=majority', {useNewUrlParser: true});
} catch (error) {
    handleError(error);
}

const Schema = mongoose.Schema;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const config = {
    secret: `Dj=yr456_m9+F.rMM65_-.eug20864G*$sv#&hWQ-^:;&8328649cDR`
}

const superLimit = 10;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));



const userSchema = new Schema({
    nick:  String,
    email: String,
    password: String,
    avatar: String,
    active: Boolean,
    admin: Boolean
    }
);
const User = mongoose.model('User', userSchema);


const postSchema = new Schema({
    userId:  String,
    title: String,
    text: String,
    active: Boolean
    }
);
const Post = mongoose.model('Post', postSchema);




const upload = multer({
    dest:"./public/uploads",
    fileFilter: function (req, file, cb) {

        if(req.headers.authorization) {
            const token = req.headers.authorization.slice('Bearer '.length);
            try {
                jwt.verify(token, config.secret);
            } catch(err) {
                cb(null, false);
            }

            const t = file.mimetype;
            if(t==="image/png" || t==="image/jpg" || t==="image/jpeg"){
                cb(null, true);
            }
            else {
                cb(null, false);
            }
        }
        else{
            cb(null, false);
        }
    },
    limits: {
        fileSize : 1024*1024*10,
        files: 1,
        parts: 1,
        fields: 0
    }
}).single("file");



app.post('/addpicture', (req, res) => {
    
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.end(JSON.stringify({msg: 'ERROR'}));

        } else {
            (async ()=>{

                const filedata = req.file;
                if(!filedata) {
                    res.end(JSON.stringify({msg: "ERROR1"}));
                    return;
                }
                else {
                    const token = req.headers.authorization.slice('Bearer '.length);
        
                    let decoded;
                    try {
                        decoded = jwt.verify(token, config.secret);
                    } catch(err) {
                        res.end(JSON.stringify({msg: 'WRONG_JWT'}));
                    }
                    
                    const _id = decoded._id;
                    const userCheck = await User.findById(_id);
                    if (userCheck && userCheck.active) {

                        const path = `/uploads/` + filedata.filename;

                        User.findByIdAndUpdate(_id, { avatar: path },
                        function(err) {
                            if (err) {
                                res.end(JSON.stringify({msg: 'ERROR2'}));
                            } else {
                                if(decoded.avatar !== 'false') {
                                    fs.unlink('./public' + decoded.avatar, function(err) {
                                        if (err) {console.log(err)};
                                    });
                                }
                                const {_id, nick, email, active, admin} = userCheck;
                                const token = jwt.sign({ _id, nick, email, avatar: path, active, admin }, config.secret);
                                res.end(JSON.stringify({_id, nick, email, avatar: path, active, admin, token}));
                            }
                    })
        
                    } 
                    else {
                        res.end(JSON.stringify({msg: 'USER_NOT_FOUND'}));
                    }
                }
            })();
        }
    })
})

app.post('/deletepictureadmin', (req, res) => {
    (async ()=>{
        const {userId, avatar, token} = req.body;

        if(!token || !avatar || !userId || Object.keys(req.body).length !== 3) {
            res.end(JSON.stringify({msg: 'ERROR'}));
            return;
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.secret);
        } catch(err) {
            res.end(JSON.stringify({msg: 'WRONG_JWT'}));
        }



        if (decoded.admin) {
            User.findByIdAndUpdate(userId, { avatar: 'false' },
            function(err) {
                if (err) {
                    res.end(JSON.stringify({msg: 'ERROR'}));
                } else {
                    fs.unlink('./public' + avatar, function(err) {
                        if (err) {console.log(err)};
                    });

                    res.end(JSON.stringify({msg: 'DELETE'}));
                }
            })
        } else {
            res.end(JSON.stringify({msg: 'NOT_ADMIT'}));
        }
    })();
})


app.post('/deletepicture', (req, res) => {
    (async ()=>{
        const {token} = req.body;

        if(!token || Object.keys(req.body).length !== 1) {
            res.end(JSON.stringify({msg: 'ERROR'}));
            return;
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.secret);
        } catch(err) {
            res.end(JSON.stringify({msg: 'WRONG_JWT'}));
        }

        const _id = decoded._id

        User.findByIdAndUpdate(_id, { avatar: 'false' },
            function(err) {
                if (err) {
                    res.end(JSON.stringify({msg: 'ERROR'}));
                } else {
                    fs.unlink('./public' + decoded.avatar, function(err) {
                        if (err) {console.log(err)};
                    });

                    const {_id, nick, email, active, admin} = decoded;
                    const token = jwt.sign({ _id, nick, email, avatar: 'false', active, admin }, config.secret);
                    res.end(JSON.stringify({_id, nick, email, avatar: 'false', active, admin, token}));
                }
        })
    })();
}) 

app.post('/user/changepassword', function (req, res) {
    (async()=>{
        const {oldPass, NewPass, token} = req.body;


        if(!oldPass || ! NewPass || !token || Object.keys(req.body).length !== 3) {
            res.end(JSON.stringify({msg: 'ERROR'}));
            return;
        }
        
        let decoded;
        try {
            decoded = jwt.verify(token, config.secret);
        } catch(err) {
            res.end(JSON.stringify({msg: 'WRONG_JWT'}));
        }

        const _id = decoded._id;
        const userCheck = await User.findById(_id);

        if (userCheck && userCheck.active) {
            if (userCheck.password === oldPass) {

                User.findByIdAndUpdate(_id, { password: NewPass },
                    function(err, result) {
                        if (err) {
                            res.end(JSON.stringify({msg: 'ERROR'}));
                        } else {
                            res.end(JSON.stringify({msg: 'CHANGED'}));
                        }
                })
                
            }
            else {
                res.end(JSON.stringify({msg: 'WRONG'}));
            }
        } 
        else {
            res.end(JSON.stringify({msg: 'USER_NOT_FOUND'}));
        }
    })();
});


app.post('/user/changenickemail', function (req, res) {
    (async()=>{
        const {nick, email, token} = req.body;

        if(!token) {
            res.end(JSON.stringify({msg: 'ERROR'}));
            return;
        }
        
        let decoded;
        try {
            decoded = jwt.verify(token, config.secret);
        } catch(err) {
            res.end(JSON.stringify({msg: 'WRONG_JWT'}));
        }


        const _id = decoded._id;
        const userCheck = await User.findById(_id);

        if (userCheck && userCheck.active) {
            let changeObj;
            if( !nick && ! email){
                res.end(JSON.stringify({msg: 'ERROR1'}));
                return;
            }

            else if (nick === null && email) {
                changeObj = {email};
            }
            else if (nick && email === null) {
                changeObj = {nick};
            }
            else if (nick && email) {
                changeObj = {nick, email}; 
            }


            User.findByIdAndUpdate(_id, changeObj,
                async function(err, result) {
                    if (err) {
                        res.end(JSON.stringify({msg: 'ERROR2'}));
                    } else {
                        const user = await User.findById(_id);
                        if (user && user._id) {
                            const {_id, nick, email, avatar, active, admin} = user;

                            const token = jwt.sign({ _id, nick, email, avatar, active, admin }, config.secret);
                            res.end(JSON.stringify({_id, nick, email, avatar, active, admin, token}));
                        }
                        else {
                            res.end(JSON.stringify({msg: 'ERROR3'}));
                        }
                    } 
            })
        } else {
            res.end(JSON.stringify({msg: 'USER_NOT_FOUND'}));
        }

    })();
});





app.post('/user/track', function (req, res) {
    (async()=>{
        const {token} = req.body;


        if(!token|| Object.keys(req.body).length !== 1) {
            res.end(JSON.stringify({msg: 'ERROR'}));
            return;
        }
        
        let decoded;
        try {
            decoded = jwt.verify(token, config.secret);
        } catch(err) {
            res.end(JSON.stringify({msg: 'WRONG_JWT'}));
        }

        const _id = decoded._id;
        const userChack= await User.findById(_id);

        if (userChack && userChack.active) {
            res.end(JSON.stringify({msg: 'ALL_OK'}));
        } else {
            res.end(JSON.stringify({msg: 'CLEAN_STORE'}));
        }
    })();
});




app.post('/user/findposts', function (req, res) {
    (async()=>{

        const {userId, skip, firstTime} = req.body;

        let resObj ={}, postsArr =[];

        if(!userId) {
            res.end(JSON.stringify({msg: 'ERROR'}));
            return;
        }

        if(firstTime === true){
            await Post.count({ userId }, function (err, count) {
                if (err) {
                    res.end(JSON.stringify({msg: 'ERROR2'}));
                    return;
                } else {
                    resObj ={...{count}}
                }
            });

            
            const user = await User.findById({_id: userId});

            if(user) {
                const {_id, nick, email, avatar, active, admin} = user;

                resObj = {...resObj, ...{_id, nick, email, avatar, active, admin}}
                
            } else {
                res.end(JSON.stringify({msg: 'ERROR3'}));
            }
        }



        const posts = await Post.find({userId}).skip(skip).limit(superLimit).sort({_id:-1});
        
        if(posts.length !==0) {
            for (let post of posts) {

                const {_id, userId, title, text, active} = post
                const obj = { _id, userId, title, text, active, time: _id.getTimestamp() }
                
                postsArr.push(obj)
            }

            res.end(JSON.stringify({...resObj, ...{postsArr}}));
        }
        res.end(JSON.stringify({msg: 'ERROR4'}));
    })()
});


app.put('/posts/count', function (req, res) {
    (async()=>{
        Post.count({ active: true }, function (err, count) {
            if (err) {
                res.end(JSON.stringify({msg: 'ERROR'}));
            } else {
                res.end(JSON.stringify({msg: count}));
            }
            res.end(JSON.stringify({msg: 'ERROR'}));
        });
    })()
});



app.post('/user/delete', function (req, res) {
    (async()=>{
        const {_id, token} = req.body;

        if(!_id, !token || Object.keys(req.body).length !== 2) {
            res.end(JSON.stringify({msg: 'ERROR'}));
            return;
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.secret);
        } catch(err) {
            res.end(JSON.stringify({msg: 'WRONG_JWT'}));
        }


        if (decoded.admin) {
            const user = await User.findById(_id);

            if (user.admin) {
                res.end(JSON.stringify({msg: "CAN'T_DELETE"}));
            }

            else {
                await User.findOneAndRemove({nick: user.nick}, async function(err, ok) {
                    if (err){ 
                        res.end(JSON.stringify({msg: 'ERROR'}));
                    } 
                    else { 
                        await Post.deleteMany({ 'userId':  _id}).then(function(){ 
                            res.end(JSON.stringify({msg: 'DELETE'}));  
                        }).catch(function(err){ 
                            res.end(JSON.stringify({msg: 'ERROR'})); 
                        }); 
                    } 
                }) 
            }
        }
        else {
            res.end(JSON.stringify({msg: 'NOT_ADMIN'}));
        }
    })();
});




app.post('/posts&users/find', function (req, res) {
    (async()=>{
        const {find} = req.body;
        let postsArr = [], usersArr = [];

        if(!find || Object.keys(req.body).length !== 1) {
            res.end(JSON.stringify({msg: 'ERROR'}));
            return;
        }

        const users = await User.find({nick: new RegExp(find, 'i'), admin: false}).limit(40);
        if (users.length !== 0) {
            for (let user of users) {
                const {_id, nick, avatar} = user;
                usersArr.push({_id, nick, avatar})
            }
        }

        const posts = await Post.find({$or: [
                                            {title: new RegExp(find, 'i')},
                                            {text: new RegExp(find, 'i')}
                                        ]}).sort({_id:-1}).limit(40);
        if (posts.length !==0) {
            for(let post of posts) {

                const user = await User.findById({_id: `${post.userId}`});
                

                if (user.nick){
                    const obj ={
                        _id: post._id,
                        time: post._id.getTimestamp(),
                        title: post.title,
                        text: post.text,
                        userId: post.userId,
                        nick: user.nick,
                        avatar: user.avatar};
                        
                        postsArr.push(obj);
                }
            }
            
        }
        res.end(JSON.stringify({postsArr, usersArr}));
    })();
});



app.post('/posts/get', function (req, res) {
    (async()=>{
        const {skip, userId} = req.body;
        let arr =[];

        if(userId) {
            const posts = await Post.find({userId}).skip(skip).limit(superLimit).sort({_id:-1});
            if(posts.length !==0) {
                res.end(JSON.stringify({postsArr: posts}));
            } else {
                res.end(JSON.stringify({msg: 'ERROR'}));
            }
        } 
        else if (skip === 0 || skip) {
            const posts = await Post.find().skip(skip).limit(superLimit).sort({_id:-1});
            
            if(posts.length !==0) {
                for(let post of posts) {
                    
                    if (post.userId){
                        const user = await User.findById({_id: `${post.userId}`});

                        if (user && user.nick){
                            const obj ={
                                _id: post._id,
                                title: post.title,
                                text: post.text,
                                userId: post.userId,
                                nick: user.nick,
                                avatar: user.avatar,
                                time: post._id.getTimestamp()}

                                
                            arr.push(obj);
                        }
                    }
                    
                }
                res.end(JSON.stringify({postsArr: arr}));
            } else {
                res.end(JSON.stringify({msg: 'NOT_FOUND'}));
            }
        } else {
            res.end(JSON.stringify({msg: 'ERROR2'}));
        }
    })()
});



app.post('/user/block&unblock', function (req, res) {
    (async()=>{
        const {_id, token} = req.body;

        if(!token|| !_id || Object.keys(req.body).length !== 2) {
            res.end(JSON.stringify({msg: 'ERROR'}));
            return;
        }
        
        let decoded;
        try {
            decoded = jwt.verify(token, config.secret);
        } catch(err) {
            res.end(JSON.stringify({msg: 'WRONG_JWT'}));
        }

        if (decoded.admin === true) {
            const user = await User.findById(_id);

            if (!user) {
                res.end(JSON.stringify({msg: 'USER_NOT_FOUND'}));
            }
            else if (user.admin) {
                res.end(JSON.stringify({msg: "CAN'T_BLOCK"}));
            }
            else {
                if(user.active === true) {
                    User.findByIdAndUpdate(_id, { active: false },
                        function(err) {
                            if (err) {
                                res.end(JSON.stringify({msg: 'ERROR'}));
                            } else {
                                res.end(JSON.stringify({msg: 'BECOME_FALSE'}));
                            }
                    })
                }

                else if (user.active === false) {
                    User.findByIdAndUpdate(_id, { active: true },
                        function(err) {
                            if (err) {
                                res.end(JSON.stringify({msg: 'ERROR'}));
                            } else {
                                res.end(JSON.stringify({msg: 'BECOME_TRUE'}));
                            }
                    })
                }

                else {
                    res.end(JSON.stringify({msg: 'ERROR2'}));
                }
            }
        } else {
            res.end(JSON.stringify({msg: 'NOT_ADMIN'}));
        }
    })();
});



app.post('/statistics', function (req, res) {
    (async()=>{
        const {token} = req.body;

        if(!token|| Object.keys(req.body).length !== 1) {
            res.end(JSON.stringify({msg: 'ERROR'}));
            return;
        }
        
        let decoded;
        try {
            decoded = jwt.verify(token, config.secret);
        } catch(err) {
            res.end(JSON.stringify({msg: 'WRONG_JWT'}));
        }

        if (decoded.admin === true) {

            const users= await User.count();
            const posts= await Post.count();

            res.end(JSON.stringify({statistic:{users, posts}}));
        } else {
            res.end(JSON.stringify({msg: 'NOT_ADMIN'}));
        }
    })();
});



app.post('/user/find', function (req, res) {
    (async()=>{
        const {skip, token, userId, nickOrEmail} = req.body;

        if(!token) {
            res.end(JSON.stringify({msg: 'ERROR'}));
            return;
        }


        let decoded;
        try {
            decoded = jwt.verify(token, config.secret);
        } catch(err) {
            res.end(JSON.stringify({msg: 'WRONG_JWT'}));
        }


        let postsArr = [];

        if (decoded.admin === true) {
            if (skip === 0 && nickOrEmail) {
                const user = await User.findOne({$or: [{nick: nickOrEmail}, {email: nickOrEmail}], admin: false});
                if (!user || user.admin) {
                    res.end(JSON.stringify({msg: 'NOT_FOUND'}));
                } 
                else {
                    const {_id, nick, email, avatar, active} = user; 

                    const amountPosts= await Post.count({ userId: _id });

                    const posts = await Post.find({userId: _id}).skip(skip).limit(superLimit).sort({_id:-1});

                    if (posts.length !== 0) {
                        for (let post of posts) {

                            const {_id, userId, title, text} = post
                            const obj = { _id, userId, title, text, time: _id.getTimestamp() }
                            
                            postsArr.push(obj)
                        }
                    }
                    res.end(JSON.stringify({_id, nick, email, avatar, active, amountPosts, postsArr}));
                }
            }
            else if(skip > 0 && userId) {
                const posts = await Post.find({userId}).skip(skip).limit(superLimit).sort({_id:-1});

                if (posts.length !== 0) {
                    for (let post of posts) {

                        const {_id, userId, title, text} = post
                        const obj = { _id, userId, title, text, time: _id.getTimestamp() }
                        
                        postsArr.push(obj)
                    }
                }
                res.end(JSON.stringify({postsArr}));
            } else {
                res.end(JSON.stringify({msg: 'ERROR2'}));
            }

        } 
        else {
            res.end(JSON.stringify({msg: 'NOT_ADMIN'}));
        }
    })()
});



app.delete('/posts/delete', function (req, res) {
    (async()=>{
        const {_id, token, userId} = req.body;

        if(!_id || !token) {
            res.end(JSON.stringify({msg: 'ERROR'}));
            return;
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.secret);
        } catch(err) {
            res.end(JSON.stringify({msg: 'WRONG_JWT'}));
        }


        if (decoded.admin || userId === decoded._id) {
            Post.findByIdAndDelete(_id, function (err, result) { 
                if (err){ 
                    res.end(JSON.stringify({msg: 'ERROR1'}));
                } else if(result){ 
                    res.end(JSON.stringify({msg: 'DELETE'}));
                }
            }) 
        } else {
            res.end(JSON.stringify({msg: 'ERROR2'}));
        }
    })()
});


app.post('/posts/update', function (req, res) {
    (async()=>{
        const {token, userId, _id, title, text} = req.body;

        if(!userId || !token || !_id || !title || !text || Object.keys(req.body).length !== 5) {
            res.end(JSON.stringify({msg: 'ERROR'}));
            return;
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.secret);
        } catch(err) {
            res.end(JSON.stringify({msg: 'WRONG_JWT'}));
        }

        if (userId === decoded._id) {
            const userCheck = await User.findById({_id: userId});

            if (userCheck && userCheck.active) {

                Post.findByIdAndUpdate(_id, { title, text },
                    function(err, result) {
                        if (err) {
                            res.end(JSON.stringify({msg: 'ERROR1'}));
                        } else if (result) {
                            res.end(JSON.stringify({msg: 'SAVE'}));
                        } else 
                        res.end(JSON.stringify({msg: 'ERROR2'}));
                })

            } else {
                res.end(JSON.stringify({msg: 'NOT_ACTIVE_OR_DELETED'}));
            }
        } else {
            res.end(JSON.stringify({msg: 'ERROR3'}));
        }

    })()
});



app.post('/posts/new', function (req, res) {
    (async()=>{
        const {token, userId, title, text} = req.body;

        if(!token || !userId || !title || !text || Object.keys(req.body).length !== 4) {
            res.end(JSON.stringify({msg: 'ERROR1'}));
            return;
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.secret);
        } catch(err) {
            res.end(JSON.stringify({msg: 'WRONG_JWT'}));
        }

        if (decoded._id === userId) {
            const userCheck = await User.findById({_id: userId});
            if (userCheck && userCheck.active) {

                const newPost = await new Post({userId, title, text, active: true});
                await newPost.save(function (err, ans) {
                    if (err) {
                        res.end(JSON.stringify({msg: 'ERROR2'}));
                        console.log('Error2')
                    } else {
                        res.end(JSON.stringify({msg: 'SAVE'}));
                    }
                })
            } else {
                res.end(JSON.stringify({msg: 'NOT_ACTIVE_OR_DELETED'}));
            }
        } else {
            res.end(JSON.stringify({msg: 'ERROR3'}));
        }


        
    })()
});


app.post('/users/new', function (req, res) {
    (async()=>{
        const {nick, email, password} = req.body;

        if(!nick || !email || !password || Object.keys(req.body).length !== 3) {
            res.end(JSON.stringify({msg: 'ERROR'}));
            return;
        }

        const check1 = await User.find({nick});
        const check2 = await User.find({email});

        if (check1.length !==0) {
            res.end(JSON.stringify({msg: 'NICK_EXIST'}));
        }
        else if (check2.length !==0){
            res.end(JSON.stringify({msg: 'EMAIL_EXIST'}));
        }
        else if (check1.length ===0 && check2.length ===0) {

            const newUser = await new User({nick, email, password, avatar: 'false', active: true, admin: false});
            await newUser.save(function (err) {
                if (err) return console.error(err);
            })

            const token = jwt.sign({_id: newUser._id, nick, email, avatar: 'false', active: true, admin: false}, config.secret);
            res.end(JSON.stringify({_id: newUser._id, nick, email, avatar: 'false', active: true, admin: false , token}));
        }
        else {
            res.end(JSON.stringify({msg: 'ERROR2'}));
        }


    })()
});


app.post('/users/get', function (req, res) {
    (async()=>{
        const {email, password} = req.body;

        if(!email || !password || Object.keys(req.body).length !== 2) {
            res.end(JSON.stringify({msg: 'ERROR'}));
            return;
        }

        const user = await User.findOne({email, password});

        if (!user) {
            res.end(JSON.stringify({msg: 'USER_NOT_FOUND'}));
        }
        else if (user.active === true) {
            const {_id, nick, email, avatar, active, admin} = user;

            const token = jwt.sign({ _id, nick, email, avatar, active, admin }, config.secret);
            res.end(JSON.stringify({_id, nick, email, avatar, active, admin, token}));
            
        } else if (user.active === false) {
            res.end(JSON.stringify({msg: 'USER_BLOCKED'}));
        } else {
            res.end(JSON.stringify({msg: 'ERROR2'}));
        }
    })()
});



app.post('/', function (req, res) {
    (async ()=>{
        if (req.headers.authorization) {
            const token = req.headers.authorization.slice('Bearer '.length);

            let decoded;
            try {
                decoded = jwt.verify(token, config.secret);
            } catch(err) {
                res.end(JSON.stringify({msg: 'WRONG_JWT'}));
            }
            

            

            if (!decoded.nick || ! decoded.email) {
                res.end(JSON.stringify({msg: 'ERROR'}));
            } else {
                const {nick, email} = decoded;
                const user = await User.findOne({nick, email});

                if (!user) {
                    res.end(JSON.stringify({msg: 'NOT_FOUND'}));
                }
                else if (user && user.active === true) {
                    const {_id, nick, email, avatar, active, admin} = user;

                    res.end(JSON.stringify({_id, nick, email, avatar, active, admin, token}));
                } 
                else if (user && user.active === false) {
                    res.end(JSON.stringify({msg: 'BLOCKED'}));
                } else {
                    res.end(JSON.stringify({msg: 'ERROR2'}));
                }
            }
            

        } else 
            res.end(JSON.stringify({msg: "HAVEN'T_TOKEN"}));
    })();
});


app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(4000, function () {
    console.log('Example app listening on port 4000!');
});










// (async ()=>{
//     let ansr = await new User({nick: 'admin1', email: 'admin1@gmail.com', password: 'a1d2m3i4n5', avatar: 'false', active: true, admin: true})
//         await ansr.save();
//     let ans = await new User({nick: 'admin2', email: 'admin2@gmail.com', password: 'a1d2m3i4n5', avatar: 'false', active: true, admin: true})
//         await ans.save();
//     let ans1 = await new User({nick: 'Wolf', email: 'wolf@gmail.com', password: 'a1234', avatar: 'false', active: true, admin: false})
//         await ans1.save();
//     let ans2 = await new User({nick: 'Fox', email: 'fox@gmail.com', password: 'a1234', avatar: 'false', active: true, admin: false})
//         await ans2.save();
//     let ans3 = await new User({nick: 'pAnDa', email: 'panda@gmail.com', password: 'a1234', avatar: 'false', active: true, admin: false})
//         await ans3.save();
//    // panda
//     let ans5 = await new User({nick: 'OWL', email: 'owl@gmail.com', password: 'a1234', avatar: 'false', active: true, admin: false})
//         await ans5.save();
//     let ans6 = await new User({nick: 'duck', email: 'duck@gmail.com', password: 'a1234', avatar: 'false', active: true, admin: false})
//         await ans6.save();
//     let ans7 = await new User({nick: 'tiger', email: 'tiger@gmail.com', password: 'a1234', avatar: 'false', active: true, admin: false})
//         await ans7.save();
//     let ans8 = await new User({nick: 'dog_11', email: 'dog11@gmail.com', password: 'a1234', avatar: 'false', active: true, admin: false})
//         await ans8.save();
//     let ans9 = await new User({nick: 'dog_12', email: 'dog12@gmail.com', password: 'a1234', avatar: 'false', active: true, admin: false})
//         await ans9.save();
//     let ans10 = await new User({nick: 'cat.123', email: 'cat123@gmail.com', password: 'a1234', avatar: 'false', active: true, admin: false})
//         await ans10.save();
//     let ans11 = await new User({nick: 'CAT.223', email: 'cat223@gmail.com', password: 'a1234', avatar: 'false', active: true, admin: false})
//         await ans11.save();
//     let ans12 = await new User({nick: 'CAT', email: 'cat@gmail.com', password: 'a1234', avatar: 'false', active: true, admin: false})
//         await ans12.save();
        
// })();







// (async ()=>{
//     let ans = await new User({nick: 'Dima Arulov', email: 'dima@gmail.com', password: '12345678', avatar: 'false', active: true, admin: true})
//         await ans.save();
//     let ans1 = await new User({nick: 'Vasya 123', email: 'vasya@gmail.com', password: '1234', avatar: 'false', active: true, admin: false})
//         await ans1.save();
//     let ans2 = await new User({nick: 'Nikita black', email: 'ktoto@gmail.com', password: '2234', avatar: 'false', active: true, admin: false})
//         await ans2.save();
//     let ans3 = await new User({nick: 'Super Person', email: 'rreett@gmail.com', password: '3234', avatar: 'false', active: true, admin: false})
//         await ans3.save();
//     let ans4 = await new User({nick: 'Cat and Dog', email: 'catdog1@gmail.com', password: '4234', avatar: 'false', active: true, admin: false})
//         await ans4.save();
//     let ans5 = await new User({nick: 'Tanks Player', email: 'tank@gmail.com', password: '5234', avatar: 'false', active: true, admin: false})
//         await ans5.save();
// })();

// (async ()=>{
//     let _id= "5f23ac2c665c69301c8a2367";   
//     let newPost = await new Post({userId: _id, title: 'Java', text: '"At vero eos et accusamus et iusto odio dignissimos ducimus quirsus mi at, aliquam mauris. Integer tortor ipsum, bibendum nec odio eu, aliquam interdum odio. Nunc urna magna, volutpat vitae dignissim sed, euismod in elit. Nam nibh lacus, vestibulum vel nulla porttitor, aliquam fringilla enim. Sed tristique justo quis odio facilisis, at porttitor dui suscipit. Proin suscipit mattis urna vitae bibendum. Maecenas aliquam quam vel ex hendrerit mattis. Etiam lorem est, ullamcorper et placerat quis, venenatis vitae odio. Vestibulum vestibulum placerat leo, in hendrerit nisi semper nec. blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias', active: true});
//         await newPost.save(); 
//     let newPost1 = await new Post({userId: _id, title: 'JavaScript', text: 'Fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minu', active: true});
//         await newPost1.save();
//     let newPost2 = await new Post({userId: _id, title: 'Super Game', text: '"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue rsus mi at, aliquam mauris. Integer tortor ipsum, bibendum nec odio eu, aliquam interdum odio. Nunc urna magna, volutpat vitae dignissim sed, euismod in elit. Nam nibh lacus, vestibulum vel nulla porttitor, aliquam fringilla enim. Sed tristique justo quis odio facilisis, at porttitor dui suscipit. Proin suscipit mattis urna vitae bibendum. Maecenas aliquam quam vel ex hendrerit mattis. Etiam lorem est, ullamcorper et placerat quis, venenatis vitae odio. Vestibulum vestibulum placerat leo, in hendrerit nisi semper nec. pleasure rationally encounter consequences that are extremely painful.', active: true});
//         await newPost2.save();
//     let newPost3 = await new Post({userId: _id, title: 'Callback', text: '"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.', active: true});
//         await newPost3.save();
//     let newPost4 = await new Post({userId: _id, title: 'Yes, it is code', text: 'Integer vel metus imperdiet, cursus mi at, aliquam mauris. Integer tortor ipsum, bibendum nec odio eu, aliquam interdum odio. Nunc urna magna, volutpat vitae dignissim sed, euismod in elit. Nam nibh lacus, vestibulum vel nulla porttitor, aliquam fringilla enim. Sed tristique justo quis odio facilisis, at porttitor dui suscipit. Proin suscipit mattis urna vitae bibendum. Maecenas aliquam quam vel ex hendrerit mattis. Etiam lorem est, ullamcorper et placerat quis, venenatis vitae odio. Vestibulum vestibulum placerat leo, in hendrerit nisi semper nec.', active: true});
//         await newPost4.save();
//     let newPost5 = await new Post({userId: _id, title: 'My dog', text: 'Integer vel metus imperdiet, cursus mi at, aliquam mauris. Integer tortor ipsum, bibendum nec odio eu, aliquam interdum odio. Nunc urna magna, volutpat vitae dignissim sed, euismod in elit. Nam nibh lacus, vestibulum vel nulla porttitor, aliquam fringilla enim. Sed tristique justo quis odio facilisis, at porttitor dui suscipit. Proin suscipit mattis urna vitae bibendum. Maecenas aliquam quam vel ex hendrerit mattis. Etiam lorem est, ullamcorper et placerat quis, venenatis vitae odio. Vestibulum vestibulum placerat leo, in hendrerit nisi semper nec.', active: true});
//         await newPost5.save();
//     let newPost6 = await new Post({userId: _id, title: 'Super Robot', text: 'Maecenas venenatis eros tortor, id ullamcorper mi hendrerit vel. Nunc aliquet venenatis odio pellentesque tempor. Nunc convallis enim in velit imperdiet, quis maximus ligula ullamcorper. Integer in mauris laoreet, viverra lectus sed, accumsan nunc. Duis ac mi vestibulum, sagittis nisi ut, fringilla velit. Vivamus a lacus ac nibh lacinia placerat non id felis. Etiam nec ante rhoncus, egestas tellus id, interdum tortor.', active: true});
//         await newPost6.save();
//     let newPost7 = await new Post({userId: _id, title: 'Maybe yes', text: 'Fuga. Et harum quidem rerumo you how all this mistaken idea ofInteger vel metus imperdiet, cursus mi at, aliquam mauris. Integer tortor ipsum, bibendum nec odio eu, aliquam interdum odio. Nunc urna magna, volutpat vitae dignissim sed, euismod in elit. Nam nibh lacus, vestibulum ve denouncing pleasure  facilis est et expedita distinctio. Nam libero tempore, rsus mi at, aliquam mauris. Integer tortor ipsum, bibendum nec odio eu, aliquam interdum odio. Nunc urna magna, volutpat vitae dignissim sed, euismod in elit. Nam nibh lacus, vestibulum vel nulla porttitor, aliquam fringilla enim. Sed tristique justo quis odio facilisis, at porttitor dui suscipit. Proin suscipit mattis urna vitae bibendum. Maecenas aliquam quam vel ex hendrerit mattis. Etiam lorem est, ullamcorper et placerat quis, venenatis vitae odio. Vestibulum vestibulum placerat leo, in hendrerit nisi semper nec. cum soluta nobis est eligendi optio cumque nihil impedit quo minu', active: true});
//         await newPost7.save();
//     let newPost8 = await new Post({userId: _id, title: 'But no', text: 'Integer vel metus imperdiet, cursus mi at, aliquam mauris. Integer tortor ipsum, bibendum nec odio eu, aliquam interdum odio. Nunc urna magna, volutpat vitae dignissim sed, euismod in elit. Nam nibh lacus, vestibulum vel nulla porttitor, aliquam fringilla enim. Sed tristique justo quis odio facilisis, at porttitor dui suscipit. Proin suscipit mattis urna vitae bibendum. Maecenas aliquam quam vel ex hendrerit mattis. Etiam lorem est, ullamcorper et placerat quis, venenatis vitae odio. Vestibulum vestibulum placerat leo, in hendrerit nisi semper nec.', active: true});
//         await newPost8.save();
//     let newPost9 = await new Post({userId: _id, title: 'Yes, it is code', text: 'Integer vel metus imperdiet, cursus mi at, aliquam mauris. Integer tortor ipsum, bibendum nec odio eu, aliquam interdum odio. Nunc urna magna, volutpat vitae dignissim sed, euismod in elit. Nam nibh lacus, vestibulum vel nulla porttitor, aliquam fringilla enim. Sed tristique justo quis odio facilisis, at porttitor dui suscipit. Proin suscipit mattis urna vitae bibendum. Maecenas aliquam quam vel ex hendrerit mattis. Etiam lorem est, ullamcorper et placerat quis, venenatis vitae odio. Vestibulum vestibulum placerat leo, in hendrerit nisi semper nec.', active: true});
//         await newPost9.save();
// })();
