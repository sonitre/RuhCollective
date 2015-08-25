let { Link } = ReactRouter;

Home = React.createClass({
    getInitialState: function() {
        return {};
    },
    render: function () {
        return (
            <div>
                <div style={styles}>
                </div>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>

            </div>
        );
    }
});

let styles = {
    backgroundImage: 'url(http://www.fashionfightingfamine.com/uploads/7/2/4/3/7243319/2146593_orig.jpg)',
    backgroundSize: 'cover',
    minHeight: 350
};