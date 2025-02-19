import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [joke, setJoke] = useState(null);

    useEffect(() => {
        fetchJoke();
    }, []);

    const fetchJoke = async () => {
        const response = await fetch('http://localhost:5000/api/joke');
        const data = await response.json();
        setJoke(data);
    };

    const voteJoke = async (emoji) => {
        await fetch(`http://localhost:5000/api/joke/${joke._id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emoji })
        });
        fetchJoke();
    };

    return (
        <div className='container'>
            {joke ? (
                <div className="joke-card">
                    <h2>{joke.question}</h2>
                    <p>{joke.answer}</p>
                    <div className="button-container">
                        {joke.availableVotes.map((emoji) => (
                            <button key={emoji} onClick={() => voteJoke(emoji)}>
                                {emoji} ({joke.votes.find(v => v.label === emoji)?.value || 0})
                            </button>
                        ))}
                    </div>
                    <button className="next-joke" onClick={fetchJoke}>Next Joke</button>
                </div>
            ) : (
                <p className="loading">Loading...</p>
            )}
        </div>
    );
}

export default App;
