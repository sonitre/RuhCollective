catalogItemStyles = {
    card: {
        width: '33%',
        display: 'inline-block',
        padding: 1,
        overflow: 'hidden',
        background: 'white',

        textAlign: 'center',
        '@media (min-width: 768px)': {
            textAlign: 'left'
        }
    },
    cardImage: {
        background: 'white',
        textAlign: 'center',
        width: '100%',
        '@media (max-width: 550px)': {
            height: 350
        },
        '@media (max-width: 500px)': {
            height: 300
        },
        '@media (max-width: 450px)': {
            height: 250
        },
        '@media (max-width: 400px)': {
            height: 200
        },
        '@media (max-width: 350px)': {
            height: 170
        }
    },
    cardDescriptionWrapper: {
        paddingTop: 10,
        width: '100%',
        display: 'inline-block',
        minHeight: 100,
        textAlign: 'center',
        background: '#f6fbfc'
    }
};