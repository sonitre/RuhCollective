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
                <div style={styles.contentWrapper}>
                    {this.props.children}
                </div>
            </div>
        );
    }
});

let styles = {
    contentWrapper: {
        padding: 10
    }
};