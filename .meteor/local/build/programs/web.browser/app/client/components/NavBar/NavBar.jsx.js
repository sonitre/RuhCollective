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
                "ul",
                null,
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        Link,
                        { to: "/" },
                        "Home"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        Link,
                        { to: "/vote" },
                        "Vote"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        Link,
                        { to: "/shop" },
                        "Shop"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        Link,
                        { to: "/about" },
                        "About"
                    )
                )
            )
        );
    }
});

})();
