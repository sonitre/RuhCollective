(function(){var _ReactRouter = ReactRouter;
var Link = _ReactRouter.Link;

NavBar = React.createClass({
    render: function () {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { style: styles.topRow },
                React.createElement(
                    Link,
                    { to: "/" },
                    React.createElement(
                        "p",
                        { style: styles.logo },
                        "RUH COLLECTIVE"
                    )
                )
            ),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "ul",
                    { style: styles.bottomRow },
                    React.createElement(
                        "li",
                        { style: styles.navItem },
                        React.createElement(
                            Link,
                            { to: "/" },
                            "HOME"
                        )
                    ),
                    React.createElement(
                        "li",
                        { style: styles.navItem },
                        React.createElement(
                            Link,
                            { to: "/vote" },
                            "VOTE"
                        )
                    ),
                    React.createElement(
                        "li",
                        { style: styles.navItem },
                        React.createElement(
                            Link,
                            { to: "/shop" },
                            "SHOP"
                        )
                    ),
                    React.createElement(
                        "li",
                        { style: styles.navItem },
                        React.createElement(
                            Link,
                            { to: "/about" },
                            "ABOUT"
                        )
                    )
                )
            )
        );
    }
});

var styles = {
    topRow: {},
    logo: {
        fontSize: 22,
        margin: 0,
        textAlign: "center",
        justifyContent: "center",
        flexDirection: "column",
        display: "flex",
        minHeight: 50
    },
    bottomRow: {
        listStyleType: "none",
        padding: 0,
        background: "black"
    },
    navItem: {
        display: "inline-block",
        padding: "20px 10px",
        textDecoration: "none",
        color: "white"
    }
};

//textAlign: 'center'

})();
