(function(){Vote = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function () {
        return {
            edits: Edits.find({}).fetch()
        };
    },
    generateEdits: function () {
        return this.data.edits.map(function (edit) {
            return React.createElement(Edit, { key: edit._id._str, edit: edit });
        });
    },
    render: function () {
        if (this.data.edits.length) {
            return React.createElement(
                "div",
                null,
                this.generateEdits()
            );
        } else {
            return React.createElement(
                "p",
                null,
                "LOADING"
            );
        }
    }
});

})();
