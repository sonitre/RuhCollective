App = React.createClass({
    getInitialState: function() {
        return {};
    },
    render: function () {
        return (
            <div>
                <div>
                    <NavBar />
                </div>
                <div>
                    {this.props.children}
                </div>
            </div>
        );
    }
});