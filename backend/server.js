const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/voting_game', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const jokeSchema = new mongoose.Schema({
    question: String,
    answer: String,
    votes: [{ label: String, value: Number }],
    availableVotes: [String]
});

const Joke = mongoose.model('Joke', jokeSchema);

app.get('/api/joke', async (req, res) => {
    const joke = await Joke.aggregate([{ $sample: { size: 1 } }]);
    res.json(joke[0]);
});

app.post('/api/joke/:id', async (req, res) => {
    const { id } = req.params;
    const { emoji } = req.body;
    const joke = await Joke.findById(id);
    if (joke) {
        const vote = joke.votes.find(v => v.label === emoji);
        if (vote) {
            vote.value += 1;
        } else {
            joke.votes.push({ label: emoji, value: 1 });
        }
        await joke.save();
        res.json(joke);
    } else {
        res.status(404).json({ message: 'Joke not found' });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));

