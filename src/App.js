import React from 'react';
import './App.css';

class App extends React.Component {
    state = { 
        quote: '', 
        rotate: false, 
        currentTime: new Date(), 
        emoji: '🌞', 
        showGreeting: true 
    };

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

        const hasVisited = localStorage.getItem('hasVisited');
        if (hasVisited) {
            this.setState({ showGreeting: false });
        } else {
            localStorage.setItem('hasVisited', 'true');
        }
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.handleMouseMove);
        clearInterval(this.timeInterval); 
    }

    fetchQuote = async () => {
        fetch('https://quotes-api-self.vercel.app/quote')
            .then(response => response.json())
            .then(data => {
                this.setState({ quote: data.quote, rotate: true }, () => {
                    setTimeout(() => this.setState({ rotate: false }), 1000);
                });
            })
            .catch(error => {
                console.error(error);
            });
    }

    handleMouseMove = (e) => {
        const card = document.querySelector('.card');
        if (!card) return;

        const { offsetWidth, offsetHeight } = card;
        const x = e.clientX - card.getBoundingClientRect().left - offsetWidth / 2;
        const y = e.clientY - card.getBoundingClientRect().top - offsetHeight / 2;

        const rotateX = (y / offsetHeight) * 20;
        const rotateY = -(x / offsetWidth) * 20;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    }

    resetTransform = () => {
        const card = document.querySelector('.card');
        if (card) {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        }
    }

    render() {
        const { quote, rotate, currentTime, emoji, showGreeting } = this.state;
        return (
            <div className="app">
                {showGreeting && (
                    <div className="cloud" style={{ position: 'fixed', bottom: '20px', right: '20px', background: 'white', borderRadius: '10px', padding: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '30px', marginRight: '10px' }}>🌻</span>
                        <p>Hi, this is Diksha. Hope you enjoy this!</p>
                    </div>
                )}
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