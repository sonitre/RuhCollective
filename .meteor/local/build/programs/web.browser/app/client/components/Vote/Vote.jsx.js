(function(){var _ReactRouter = ReactRouter;
var Link = _ReactRouter.Link;

Vote = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function () {
        return {
            edits: Edits.find({}).fetch()
        };
    },
    getInitialState: function () {
        return {};
    },
    render: function () {
        if (this.data.edits.length) {
            console.log('edits ', this.data.edits);
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'h3',
                    null,
                    'Vote'
                )
            );
        } else {
            return React.createElement(
                'p',
                null,
                'LOADING'
            );
        }
    }
});

})();
