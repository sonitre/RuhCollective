Edit = React.createClass({
    generateProducts() {
        return this.props.edit.products.map( product => {
            return <Product parent='edit' key={product} product={product} />
        })
    },
    render() {
        return (
            <div>
                <h3 style={styles.editTitle}>Vote for the "{this.props.edit.name}"</h3>
                { this.generateProducts() }
            </div>
        );
    }
});

let styles = {
    editTitle: {
        textAlign: 'center'
    }
};