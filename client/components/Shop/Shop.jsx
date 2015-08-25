let { Link } = ReactRouter;

Shop = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function() {
        return {
            brands: Brands.find({}).fetch()
        };
    },
    getInitialState: function() {
        return {};
    },
    render: function () {
        console.log('brands ', this.data.brands)
        return (
            <div>
                <h3>Shop</h3>
            </div>
        );
    }
});