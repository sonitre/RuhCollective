let { Link } = ReactRouter;

NavBar = React.createClass({
    getInitialState: function() {
        return {};
    },
    render: function () {
        return (
            <div>
                <div style={styles.topRow}>
                    <p>RUH COLLECTIVE</p>
                </div>
                <div>
                    <ul style={styles.bottomRow}>
                        <li style={styles.navItem}><Link to="/">HOME</Link></li>
                        <li style={styles.navItem}><Link to="/vote">VOTE</Link></li>
                        <li style={styles.navItem}><Link to="/shop">SHOP</Link></li>
                        <li style={styles.navItem}><Link to="/about">ABOUT</Link></li>
                    </ul>
                </div>
            </div>
        );
    }
});

let styles = {
    topRow: {
        textAlign: 'center'
    },
    bottomRow: {
        listStyleType: 'none',
        padding: 0,
        background: 'black'
    },
    navItem: {
        display: 'inline-block',
        padding: '20px 10px',
        textDecoration: 'none',
        color: 'white'
    }
};