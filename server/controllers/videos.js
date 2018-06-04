// Import modules
var fs = require('fs');
var mime = require('mime');
var gravatar = require('gravatar');
//set image file types
var VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/ogv'];

var Videos = require('../models/videos');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

// Show images gallery
exports.show = function (req, res) {

    sequelize.query('select v.id, v.title, v.videoName, u.email AS user_id from Videos v join Users u on v.user_id = u.id', {model:Videos})
    .then((videos)=>{
        res.render('videos',{
            title:'Videos Page',
            videos: videos,
            gravatar:gravatar.url(videos.user_id,{s:'80', r:'x', d:'retro'}, true)
        });
    }).catch((err)=>{
        return res.status(400).send({
            message:err
        });
    });
};

//Image upload
exports.uploadVideo = function (req, res){
    var src, dest, targetPath, targetName, tempPath = req.file.path;
    console.log(req.file);
    //get the mime type of the file
    var type = mime.lookup(req.file.mimetype);
    //get file extension
    var extension = req.file.path.split(/[. ]+/).pop();
    //get support file types
    if (VIDEO_TYPES.indexOf(type) ==-1){
        return res.status(415).send('Supported video formats: mp4, webm, ogg, ogv.')
    }
    //set new path to videos
    targetPath = './public/videos/'+req.file.originalname;
    //using read Stream APU to read file
    src = fs.createReadStream(tempPath);
    //using write stream API to write file
    dest = fs.createWriteStream(targetPath);
    src.pipe(dest);
    //show error
    src.on('error', function (err){
        if(err){
            return res.status(500).send({
                message:err
            });
        };
    });
    // Save file 
    src.on('end', function(){
        //create a new instance of the Images model with request body
        var videoData = {
            title:req.body.title,
            videoName:req.file.originalname,
            user_id:req.user.id
        }
        //save to database
        Videos.create(videoData).then((newVideo, created)=>{
            if(!newVideo){
                return res.send(400,{
                    message:"error"
                })
            }
            res.redirect('videos') 
        })

        //remove from temp folder
        fs.unlink(tempPath, function(err){
            if(err){
                return res.status(500).send({
                    message:err
                });
            }
        });
    })
    //Redirect to gallery's page
    //res.redirect('videos');
};

//Images authorization middleware
exports.hasAuthorization = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};