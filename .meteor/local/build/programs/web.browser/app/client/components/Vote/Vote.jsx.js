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
    generateEdits: function () {
        return this.data.edits.map(function (edit) {
            return React.createElement(Edit, { edit: edit });
        });
    },
    render: function () {
        if (this.data.edits.length) {
            console.log('edits in render ', this.data.edits);
            return React.createElement(
                'div',
                null,
                this.generateEdits()
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
