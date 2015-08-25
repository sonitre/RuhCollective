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
                { style: styles.contentWrapper },
                this.props.children
            )
        );
    }
});

var styles = {
    contentWrapper: {
        padding: 10
    }
};

})();
