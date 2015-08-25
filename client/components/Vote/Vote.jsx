let { Link } = ReactRouter;

Vote = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function() {
        return {
            edits: Edits.find({}).fetch(),
            product: Products.find({edit: '55dcd045f25251005d000001'}).fetch()
        };
    },
    getInitialState: function() {
        return {};
    },
    //getEditProducts() {
    //    return this.data.edits[0].products.map( product => {
    //        return Product.find({_id: product}.fetch())
    //    })
    //},
    render: function () {
        if (this.data.edits.length){
            console.log('edits ', this.data.edits)
            let stuff = Products.find({edit: this.data.edits[0]._id._str}).fetch()
            console.log('stuff ', this.data.product)
            return (
                <div>
                    <h3>Vote</h3>
                </div>
            );
        } else {
            return <p>LOADING</p>
        }
    }
});