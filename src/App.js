import React from 'react';
import './App.css';
import axios from 'axios';

class App extends React.Component {
    state = { quote: '', rotate: false };

    componentDidMount() {
        this.fetchQuote();
        window.addEventListener('mousemove', this.handleMouseMove);
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.handleMouseMove);
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
        const { quote, rotate } = this.state;
        return (
            <div className="app">
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