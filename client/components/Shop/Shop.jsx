let { Link } = ReactRouter;

Shop = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        return {
            products: Products.find({}).fetch()
        };
    },
    generateProducts() {
        return this.data.products.map( product => {
            return <Product parent='shop' key={product._id._str} product={product} />
        })
    },
    render: function () {
        if (this.data.products) {
            return (
                <div>
                    <h3>Shop</h3>
                    { this.generateProducts() }
                </div>
            );
        } else {
            return (
                <p>Loading</p>
            )
        }

    }
});