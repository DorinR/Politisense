import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

// hardcoded data for the list of ridings
const ridings = [
    'north okanagan—shuswap',
    'cloverdale—langley city',
    'gaspésie—les îles-de-la-madeleine',
    'edmonton manning',
    'portneuf—jacques-cartier',
    'delta',
    'st. catharines',
    'bruce—grey—owen sound',
    'papineau',
];

// Function that returns a list of all ridings
export async function fetchAllRidings() {
    let ridings = []
    // axios call here to endpoint that returns list of ridings
    return ridings
}

// Function that sets new riding
// Input: userEmail, newRiding
// Output: whether or not the update was successful
export async function setNewRiding(userEmail, newRiding) {
    // axios call that updates the user in the DB
}

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function RidingSwitcher() {
    const classes = useStyles();
    const theme = useTheme();
    const [personName, setPersonName] = React.useState([]);

    const handleChange = event => {
        setPersonName(event.target.value);
        // investigate if there is a better alternative for the below
        window.location.reload(false);
    };

    return (
        <div>
            <FormControl className={classes.formControl}>
                <Select
                    value={personName}
                    onChange={handleChange}
                    input={<Input />}
                    MenuProps={MenuProps}
                >
                    {ridings.map(name => (
                        <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}