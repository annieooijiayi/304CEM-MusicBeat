const Record = require('./database');
const User = require('./userModel');
const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
var validator = require("email-validator");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcrypt');
const saltRounds = 10;

require('dotenv').config();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(cors({ 
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));

app.use(session({
    key: "userID",
    secret: "super_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 1000 * 60 * 60 * 24
    },
}));

app.use(express.json());

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]

    if (!token){
      res.send("We need a token.")
    }
    else{
      jwt.verify(token, "jwtSecret", (err, decoded) => {
        if (err){
          res.json({auth: false, message: "You failed to authenticate"});
        }
        else{
          req.user_id = decoded.id;
            next();
        }
      });
    }
}

app.get('/isUserAuth', verifyJWT, (req, res) => {
    res.json(req.session.user);
});

app.get('/login', (req, res) => {
    if (req.session.user) {
      res.send({loggedIn: true, user: req.session.user});
    }
    else{
        res.send({loggedIn: false});
    }
});

app.post('/login', (req,res) => {
    const user_email = req.body.user_email;
    const user_password = req.body.user_password;
  
    if (!user_email || !user_password){
      res.json({auth:false, message: 'Please fill in all the fields!'});
    }else{
    User.find(
        {user_email:user_email},
      function(err, result){
        if (err){
          res.send({err: err});
        }
        if(result.length > 0){
          bcrypt.compare(user_password, result[0].user_password, (error, response) => {
            if (response){
              
              const id = result[0].user_id;
              const token = jwt.sign({id}, "jwtSecret", 
              {
                expiresIn:1000 * 60 * 60 * 24
              });
              req.session.user = result;
              res.json({auth: true, token: token, result: result});
  
            }else{
              res.json({auth: false, message: "Incorrect password!"});
            }
          });
        }else{
          res.json({auth:false, message: 'User does not exist!'});
        }
        
      }      
    );
    }
  });

  app.get('/profile', (req, res) =>{

    if (req.session.user){
        res.json({user: req.session.user});
    }
    else{
        res.send("No user found");
    }
});

app.get('/music/:track/:artist', async (req, res) => {
    const apikey = '58ba0b98930f24a4e32ebda68e2959a2';
    const apikey1 = '817708954ba80990bd05fa7542f11ed4';
    //const track = req.query.track;
    //const artist = req.query.artist;
    //const track = 'Loner';
    //const artist = 'CNBlue';
    const track = req.params.track;
    const artist = req.params.artist;
    var track_id;

    const querystr =   `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apikey}&artist=${artist}&track=${track}&format=json`;
    axios.get(querystr).then((response) => {
        track_title = response.data.track.name;
        track_artist = response.data.track.artist.name;
        //album_title = response.data.track.album.title;
        console.log("Track Title: " + track_title);
        console.log("Artist: " + track_artist);
        //console.log("Album Title: " + album_title);


        const querystr1 = `http://api.musixmatch.com/ws/1.1/track.search?q_artist=${artist}&q_track=${track}&apikey=${apikey1}`;
        axios.get(querystr1).then((response) => {
            
                track_id = response.data.message.body.track_list[0].track.track_id;

            const querystr2 = `http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${track_id}&apikey=${apikey1}`;
            axios.get(querystr2).then((response) => {
                
                    lyrics = response.data.message.body.lyrics.lyrics_body
                    console.log(lyrics);

                    musicValue = new Record ({
                        trackTitle: track_title,
                        trackArtist: track_artist,
                        //albumTitle: album_title,
                        lyrics: lyrics
                    });
                    musicValue.save().then(result => {
                        console.log(result);
                        console.log("Success");
                    });

                    res.write("<p> Track Title: " + track_title + "</p>");
                    res.write("<p> Track Artist: " + track_artist + "</p>");
                    res.write("Lyrics: <br>" + lyrics);
                    res.send();
                
            });
            
        });
    });
});

app.get('/musicList', (req,res) => {
    Record.find((err, docs) =>{
        if (err){
            console.log('Failed to retrieve data. Error: ' + err);
        }
        else{
            res.send(docs);
        }
    });

})

app.delete('/delete_music/:id', (req, res) => {
    
    Record.findByIdAndRemove(req.params.id).
    exec()
    .then(doc => {
        if (!doc){
            return res.status(404).end();
        }
        return res.status(204).end();
    }).catch(err => next(err));

    
});

app.put('/update/:id', async(req,res)=>{
    const newLyrics = req.body.lyrics;
    const id = req.params.id;

    Record.findByIdAndUpdate(id, {lyrics:newLyrics}, function(err, docs){
        if (err){
            console.log(err)
        }else{
            console.log("Updated Doc: ", docs);
        }
    });
})

app.post('/signup', (req, res) => {
    const user_name = req.body.user_name;
    const user_email = req.body.user_email;
    const user_password = req.body.user_password;
    let errors = [];
    
    if (!user_name || !user_email || !user_password){
      errors.push({message: 'Please fill in all the fields.'});
      res.send({message: "Please fill in all the fields."});
    }
  
    if (validator.validate(user_email) == false){
      errors.push({message: 'Email format is invalid.'});
      res.send({message: "Email format is invalid."});
    }
  
    if (user_password.length < 6){
      errors.push({message: 'Password should be atleast 6 characters.'});
      res.send({message: "Password should be atleast 6 characters."});
    }
  
    if (errors.length == 0){
  
      User.find(
        {user_email:user_email},
        function(err, result) {
          if (result.length > 0){
            res.send({message: "The email is already existed in the database!"});
          }else{
            bcrypt.hash(user_password, saltRounds, (err, hash) => {
        
              if (err){
                console.log(err);
              }
        
              userValue = new User ({
                user_name: user_name,
                user_email: user_email,
                user_password: hash
            });
            userValue.save().then(result => {
                console.log(result);
                console.log("Success");
                res.send({message:'Registered successfully!'});
            });
            });
          }
        }
      );
    }
  });

app.listen(process.env.PORT || 5000, () => {
    console.log('Server listening on port 5000');
});





