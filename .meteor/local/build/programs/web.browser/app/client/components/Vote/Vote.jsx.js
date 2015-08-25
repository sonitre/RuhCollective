(function(){var _ReactRouter = ReactRouter;
var Link = _ReactRouter.Link;

Vote = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function () {
        return {
            edits: Edits.find({}).fetch(),
            product: Products.find({ edit: '55dcd045f25251005d000001' }).fetch()
        };
    },
    getInitialState: function () {
        return {};
    },
    //getEditProducts() {
    //    return this.data.edits[0].products.map( product => {
    //        return Product.find({_id: product}.fetch())
    //    })
    //},
    render: function () {
        if (this.data.edits.length) {
            console.log('edits ', this.data.edits);
            var stuff = Products.find({ edit: this.data.edits[0]._id._str }).fetch();
            console.log('stuff ', this.data.product);
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
