Vote = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        return {
            edits: Edits.find({}).fetch()
        };
    },
    generateEdits() {
        return this.data.edits.map( edit => {
            return <Edit key={edit._id._str} edit={edit} />
        })
    },
    render() {
        if (this.data.edits.length){
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