(function(){App = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                null,
                React.createElement(NavBar, null)
            ),
            React.createElement(
                "div",
                null,
                this.props.children
            )
        );
    }
});

})();
