import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    IconButton
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Radar from 'react-d3-radar'

import mockData from './Data';

const useStyles = makeStyles(() => ({
    root: {
        height: '100%'
    },
    content: {
        padding: 0
    },
    image: {
        height: 48,
        width: 48
    },
    actions: {
        justifyContent: 'flex-end'
    }
}));

const LatestProducts = props => {
    const { className, ...rest } = props;

    const classes = useStyles();

    const [products] = useState(mockData);

    return (
        <Card
            {...rest}
            className={clsx(classes.root, className)}
        >
            <CardHeader
                subtitle={`${products.length} in total`}
                title="Latest products"
            />
            <Divider />
            <CardContent className={classes.content}>
                <Radar
                    width={400}
                    height={385}
                    padding={55}
                    domainMax={props.radarData[1] + 3}
                    highlighted
                    onHover={point => {
                        if (point) {
                        } else {
                        }
                    }}
                    data={{
                        variables: [
                            { key: 'trade', label: 'Trade' },
                            { key: 'criminal', label: 'Criminal' },
                            { key: 'business', label: 'Business' },
                            { key: 'Economics', label: 'Economics' },
                            { key: 'Healthcare', label: 'Healthcare' },
                            { key: 'Religion', label: 'Religion' },
                            { key: 'Human Rights', label: 'Human Rights' }
                        ],
                        sets: [
                            {
                                values: props.radarData[0]
                            }
                        ]
                    }}
                />
            </CardContent>
            <Divider />
            <CardActions className={classes.actions}>
                <Button
                    color="primary"
                    size="small"
                    variant="text"
                >
                    View all <ArrowRightIcon />
                </Button>
            </CardActions>
        </Card>
    );
};

LatestProducts.propTypes = {
    className: PropTypes.string
};

export default LatestProducts;