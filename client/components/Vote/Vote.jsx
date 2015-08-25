let { Link } = ReactRouter;

Vote = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function() {
        return {
            edits: Edits.find({}).fetch()
        };
    },
    getInitialState: function() {
        return {};
    },
    render: function () {
        if (this.data.edits.length){
            console.log('edits ', this.data.edits)
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