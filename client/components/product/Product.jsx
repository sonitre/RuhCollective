let { Link } = ReactRouter;

Product = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        return {
            products: Products.find({}).fetch()
        };
    },
    getInitialState: function() {
        return {

        };
    },
    populateProduct(id) {
        return _.find(this.data.products, function (product) {
            return product._id._str === id
        });
    },
    //getLowestSalePrice() {
    //    if (product.onSale){
    //        let lowestSalePrice = null;
    //        product.items.forEach( item => {
    //            if (!lowestSalePrice && item.salePrice){
    //                lowestSalePrice = item.salePrice;
    //            }
    //            else if (!!item.salePrice && (item.salePrice < lowestSalePrice)){
    //                lowestSalePrice = item.salePrice;
    //            }
    //        });
    //        return lowestSalePrice;
    //    }
    //},
    render() {
        if (this.data.products.length) {
            let product = this.populateProduct(this.props.product);
            console.log('product?? ', product)
            //let oldPriceStyle = {}, salePriceStyle = {};
            let url = '/product/' + product._id._str;
            let alt = 'image for ' + product.name;
            //let salePrice = this.getLowestSalePrice();
            //if (salePrice){
            //    salePrice = '$' + (salePrice/100).toFixed(2);
            //    oldPriceStyle = {textDecoration: 'line-through'};
            //    salePriceStyle = {color: 'red'};
            //}
            return (
                <div key='card' style={catalogItemStyles.card}>
                    <Link to={url} item={product}>
                        <img style={catalogItemStyles.cardImage} key='image' src={product.imageThumbnail} alt={alt}/>

                        <div style={catalogItemStyles.cardDescriptionWrapper}>

                            <p>{product.name}</p>

                            <p>${(product.price / 100).toFixed(2)}</p>
                        </div>
                    </Link>
                </div>
            )
        } else {
            return (
                <p>Loading</p>
            )
        }
    }
});

