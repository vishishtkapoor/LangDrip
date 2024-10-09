import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={{ textAlign: 'center', padding: '20px', fontSize: '20px' }}>
            <p>Crafted with passion & a lot of coffee ☕ by Vishisht</p>
            <p>
                Follow me on{' '}
                <a href="https://x.com/devvishisht" target="_blank" rel="noopener noreferrer">
                    X(Twitter)
                </a>{' '}
                |{' '}
                <a href="https://github.com/vishishtkapoor" target="_blank" rel="noopener noreferrer">
                    GitHub
                </a>
            </p>
        </footer>
    );
};

export default Footer;
