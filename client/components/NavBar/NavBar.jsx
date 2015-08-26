let { Link } = ReactRouter;

NavBar = React.createClass({
    render() {
        return (
            <div>
                <div style={styles.topRow}>
                    <Link to="/"><p style={styles.logo}>RUH COLLECTIVE</p></Link>
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
        //textAlign: 'center'
    },
    logo: {
        fontSize: 22,
        margin: 0,
        textAlign: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        display: 'flex',
        minHeight: 50
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