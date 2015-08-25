(function(){var _ReactRouter = ReactRouter;
var Link = _ReactRouter.Link;

NavBar = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { style: styles.topRow },
                React.createElement(
                    "p",
                    null,
                    "RUH COLLECTIVE"
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
    topRow: {
        textAlign: "center"
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

})();
