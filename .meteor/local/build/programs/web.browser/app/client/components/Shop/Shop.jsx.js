(function(){var _ReactRouter = ReactRouter;
var Link = _ReactRouter.Link;

Shop = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function () {
        return {
            products: Products.find({}).fetch()
        };
    },
    generateProducts: function () {
        return this.data.products.map(function (product) {
            return React.createElement(Product, { parent: 'shop', key: product._id._str, product: product });
        });
    },
    render: function () {
        if (this.data.products) {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'h3',
                    null,
                    'Shop'
                ),
                this.generateProducts()
            );
        } else {
            return React.createElement(
                'p',
                null,
                'Loading'
            );
        }
    }
});

})();
