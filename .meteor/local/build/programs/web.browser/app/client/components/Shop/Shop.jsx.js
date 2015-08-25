(function(){var _ReactRouter = ReactRouter;
var Link = _ReactRouter.Link;

Shop = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function () {
        return {
            brands: Brands.find({}).fetch()
        };
    },
    getInitialState: function () {
        return {};
    },
    render: function () {
        console.log('brands ', this.data.brands);
        return React.createElement(
            'div',
            null,
            React.createElement(
                'h3',
                null,
                'Shop'
            )
        );
    }
});

})();
