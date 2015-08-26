let { Link } = ReactRouter;

Product = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        return {
            products: Products.find({}).fetch()
        };
    },
    populateProduct() {
        let self = this;
        return _.find(this.data.products,  product => {
            return product._id._str === self.props.product
        });
    },
    voteForProduct() {
        Meteor.call('voteForProduct', this.props.product);
    },
    render() {
        if (this.data.products.length) {
            let product = this.props.parent === 'shop' ? this.props.product : this.populateProduct();
            console.log('product?? ', product)
            let url = '/product/' + product._id._str;
            let alt = 'image for ' + product.name;
            return (
                <div key='card' style={catalogItemStyles.card}>
                    <Link to={url} item={product}>
                        <img style={catalogItemStyles.cardImage} key='image' src={product.imageThumbnail} alt={alt}/>
                    </Link>
                    <div style={catalogItemStyles.cardDescriptionWrapper}>

                        <p>{product.name}</p>

                        <p>${(product.price / 100).toFixed(2)}</p>

                        <button onClick={this.voteForProduct}>Vote!</button><br />

                        <span>Votes: {product.votes}</span>

                    </div>
                </div>
            )
        } else {
            return (
                <p>Loading</p>
            )
        }
    }
});

