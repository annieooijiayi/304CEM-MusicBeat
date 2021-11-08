const mongoose = require ('mongoose');

const db="mongodb+srv://annie_ojy:50dIut1tQzDvTsYz@cluster0.mkcqi.mongodb.net/MusicDB?retryWrites=true&w=majority";

mongoose.connect(db).then(() =>{
    console.log("Connected to database");
})
.catch(() => {
    console.log("Error connecting to database");
});

const schema = new mongoose.Schema({
    trackTitle: {type: String},
    trackArtist: {type: String},
    albumTitle: {type: String},
    lyrics: {type: String}
});

const Record = mongoose.model('musics', schema);

module.exports = Record;

