let { Link } = ReactRouter;

Vote = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        return {
            edits: Edits.find({}).fetch()
        };
    },
    getInitialState() {
        return {};
    },
    generateEdits() {
        return this.data.edits.map( edit => {
            return <Edit edit={edit} />
        })
    },
    render() {
        if (this.data.edits.length){
            console.log('edits in render ', this.data.edits)
            return (
                <div>
                    { this.generateEdits() }
                </div>
            );
        } else {
            return <p>LOADING</p>
        }
    }
});