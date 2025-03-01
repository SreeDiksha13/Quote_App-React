import React from 'react';
import './App.css';
import axios from 'axios';

class App extends React.Component {
    state = { quote: '', rotate: false, currentTime: new Date(), emoji: '🌞' };

    componentDidMount() {
        this.fetchQuote();
        window.addEventListener('mousemove', this.handleMouseMove);
        this.timeInterval = setInterval(() => {
            const now = new Date();
            this.setState({ 
                currentTime: now,
                emoji: (now.getHours() >= 6 && now.getHours() < 18) ? '🌞' : '🌜' 
            });
        }, 1000); 
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.handleMouseMove);
        clearInterval(this.timeInterval); 
    }

    fetchQuote = () => {
        axios.get('https://api.quotable.io/random')
            .then((response) => {
                const quote = response.data.content;
                this.setState({ quote: quote, rotate: true }, () => {
                    setTimeout(() => this.setState({ rotate: false }), 1000); 
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleMouseMove = (e) => {
        const card = document.querySelector('.card');
        const { offsetWidth, offsetHeight } = card;
        const x = e.clientX - card.getBoundingClientRect().left - offsetWidth / 2;
        const y = e.clientY - card.getBoundingClientRect().top - offsetHeight / 2;

        const rotateX = (y / offsetHeight) * 20;
        const rotateY = -(x / offsetWidth) * 20;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    }

    resetTransform = () => {
        const card = document.querySelector('.card');
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    }

    render() {
        const { quote, rotate, currentTime, emoji } = this.state;
        return (
            <div className="app">
                <div className="clock" style={{ position: 'absolute', top: 10, right: 10, fontSize: '1.2rem', backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
                    {emoji} {currentTime.toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        second: "2-digit",
                        hour12: true,
                    })}
                </div>
                <div className="card" onMouseLeave={this.resetTransform}>
                    <span className={`emoji ${rotate ? 'rotate' : ''}`} role="img" aria-label="sparkle">✨</span>
                    <h1 className="quote">{quote}</h1>
                    <button className="button" onClick={this.fetchQuote}>New Quote</button>
                </div>
            </div>
        );
    }
}

export default App;