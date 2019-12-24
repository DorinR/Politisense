import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import PieChartIcon from '@material-ui/icons/PieChart';
import Icon from '@material-ui/core/Icon';
import { loadCSS } from 'fg-loadcss';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import GavelIcon from '@material-ui/icons/Gavel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBalanceScale, faHandshake } from '@fortawesome/free-solid-svg-icons';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
    card: {
        // maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    table: {
        // minWidth: 650,
    }
}));

function createData(name, vote) {
    return { name, vote };
}

export default function CategoryCard(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [id,setId]= React.useState(0)
    const [title,setTitle]= React.useState('')

    function setCardLogo(){
        switch(title) {
            case 'Economics':
                return <TrendingUpIcon color="primary" />
            case 'Criminal':
                return <GavelIcon color="primary" />
            case 'Human Rights':
                return <FontAwesomeIcon icon={faBalanceScale} color="#43D0C4" size="lg" />
            default:
                return <IndeterminateCheckBoxIcon color="primary" />;
        }
    }

    React.useEffect(() => {
        setId(props.id)
        setTitle(props.title)
        loadCSS(
            'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
            document.querySelector('#font-awesome-css'),
        );
    }, []);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const rows = [
        createData('Bill 101', 'Yes'),
        createData('Bill 102', 'No'),
        createData('Bill 103', 'Abstain'),
    ];

    return (
                <Card className={classes.card}>
                    <CardHeader
                        avatar={setCardLogo()}
                        action={
                            <IconButton aria-label="settings" onClick={props.delete}>
                                <IndeterminateCheckBoxIcon color='primary'/>
                            </IconButton>
                        }
                        title={title}
                    />
                    <CardContent>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Bill Name</TableCell>
                                    <TableCell align="right">Vote</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map(row => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.vote}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton>
                            <CompareArrowsIcon color="primary"/>
                        </IconButton>
                        <IconButton>
                            <PieChartIcon color="primary" />
                        </IconButton>
                        <IconButton>
                            <FontAwesomeIcon icon={faHandshake} color="#43D0C4" />
                        </IconButton>
                    </CardActions>
                </Card>

    );
}
