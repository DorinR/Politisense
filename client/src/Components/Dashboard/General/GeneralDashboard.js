import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import HelpIcon from '@material-ui/icons/Help';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import EventSeatIcon from '@material-ui/icons/EventSeat';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import 'typeface-roboto';
import RepresentativeImage from "../Sidebar/RepresentativeImage";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import MinisterHelpDialog from "./MinisterHelpDialog";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  pos: {
    marginBottom: 12,
  },
  navbarCustomFont: {
    color: '#D71921',
    fontWeight: 'bold',
  },
  current: {
    verticalAlign: 'text-top'
  },
  seats: {
    border: 'solid'
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  prime: {
    marginTop: '30px',
    marginBottom: '30px',
    width: '45%'
  },
  help: {
    cursor: 'pointer'
  },
  cardHeader: {
    backgroundColor: '#43D0C4',
    color:'white'
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

const ministers = [
  {
    title: 'Chrystia Freeland',
    subheader: 'Deputy Prime Minister and Minister of Intergovernmental Affairs',
    description: ['20 November 2019', 'University—Rosedale', 'https://pm.gc.ca/en/cabinet/honourable-chrystia-freeland'],
  },
  {
    title: 'Lawrence MacAulay',
    subheader: 'Minister of Veterans Affairs and Associate Minister of National Defence',
    description: ['1 March 2019', 'Cardigan', 'https://pm.gc.ca/en/cabinet/honourable-lawrence-macaulay'],
  },
  {
    title: 'Carolyn Bennett',
    subheader: 'Minister of Crown-Indigenous Relations',
    description: ['4 November 2015', 'Toronto—St. Paul’s', 'https://pm.gc.ca/en/cabinet/honourable-carolyn-bennett'],
  },
  {
    title: 'Dominic LeBlanc',
    subheader: 'President of the Queen’s Privy Council for Canada',
    description: ['18 July 2018', 'Beauséjour', 'https://pm.gc.ca/en/cabinet/honourable-dominic-leblanc'],
  },
  {
    title: 'Navdeep Bains',
    subheader: 'Minister of Innovation, Science and Industry',
    description: ['4 November 2015', 'Mississauga—Malton', 'https://pm.gc.ca/en/cabinet/honourable-navdeep-bains'],
  },
  {
    title: 'Bill Morneau',
    subheader: 'Minister of Finance',
    description: ['4 November 2015', 'Toronto Centre', 'https://pm.gc.ca/en/cabinet/honourable-bill-morneau'],
  },
  {
    title: 'Jean-Yves Duclos',
    subheader: 'President of the Treasury Board',
    description: ['20 November 2019', 'Québec', 'https://pm.gc.ca/en/cabinet/honourable-jean-yves-duclos'],
  },
  {
    title: 'Marc Garneau',
    subheader: 'Minister of Transport',
    description: ['4 November 2015', 'Notre-Dame-de-Grâce—Westmount', 'https://pm.gc.ca/en/cabinet/honourable-marc-garneau'],
  },
  {
    title: 'Marie-Claude Bibeau',
    subheader: 'Minister of Agriculture and Agri-Food',
    description: ['1 March 2019', 'Compton—Stanstead', 'https://pm.gc.ca/en/cabinet/honourable-marie-claude-bibeau'],
  },
  {
    title: 'Mélanie Joly',
    subheader: 'Minister of Economic Development and Official Languages',
    description: ['18 July 2018', 'Ahuntsic-Cartierville', 'https://pm.gc.ca/en/cabinet/honourable-melanie-joly'],
  },
  {
    title: 'Diane Lebouthillier',
    subheader: 'Minister of National Revenue',
    description: ['4 November 2015', 'Gaspésie—Les Îles-de-la-Madeleine', 'https://pm.gc.ca/en/cabinet/honourable-diane-lebouthillier'],
  },
  {
    title: 'Catherine McKenna',
    subheader: 'Minister of Infrastructure and Communities',
    description: ['20 November 2019', 'Ottawa Centre', 'https://pm.gc.ca/en/cabinet/honourable-catherine-mckenna'],
  },
  {
    title: 'Harjit S. Sajjan',
    subheader: 'Minister of National Defence',
    description: ['4 November 2015', 'Vancouver South', 'https://pm.gc.ca/en/cabinet/honourable-harjit-sajjan'],
  },
  {
    title: 'Maryam Monsef',
    subheader: 'Minister of Women and Gender Equality,' +
        'Minister of Rural Economic Development',
    description: ['10 January 2017,' +
    '20 November 2019', 'Peterborough—Kawartha', 'https://pm.gc.ca/en/cabinet/honourable-maryam-monsef'],
  },
  {
    title: 'Carla Qualtrough',
    subheader: 'Minister of Employment, Workforce Development and Disability Inclusion',
    description: ['20 November 2019', 'Delta', 'https://pm.gc.ca/en/cabinet/honourable-carla-qualtrough'],
  },
  {
    title: 'Patty Hajdu',
    subheader: 'Minister of Health',
    description: ['20 November 2019', 'Thunder Bay—Superior North', 'https://pm.gc.ca/en/cabinet/honourable-patty-hajdu'],
  },  {
    title: 'Bardish Chagger',
    subheader: 'Minister of Diversity and Inclusion and Youth',
    description: ['20 November 2019', 'Waterloo', 'https://pm.gc.ca/en/cabinet/honourable-bardish-chagger'],
  },  {
    title: 'François-Philippe Champagne',
    subheader: 'Minister of Foreign Affairs',
    description: ['20 November 2019', 'Saint-Maurice—Champlain', 'https://pm.gc.ca/en/cabinet/honourable-francois-philippe-champagne'],
  },
  {
    title: 'Karina Gould',
    subheader: 'Minister of International Development',
    description: ['20 November 2019', 'Burlington', 'https://pm.gc.ca/en/cabinet/honourable-karina-gould'],
  },
  {
    title: 'Ahmed Hussen',
    subheader: 'Minister of Families, Children, and Social Development',
    description: ['20 November 2019', 'York South—Weston', 'https://pm.gc.ca/en/cabinet/honourable-ahmed-hussen'],
  },
  {
    title: 'Seamus O\'Regan',
    subheader: 'Minister of Natural Resources',
    description: ['20 November 2019', 'St. John\'s South—Mount Pearl', 'https://pm.gc.ca/en/cabinet/honourable-seamus-oregan'],
  },
  {
    title: 'Pablo Rodriguez',
    subheader: 'Leader of the Government in the House of Commons',
    description: ['20 November 2019', 'Honoré-Mercier', 'https://pm.gc.ca/en/cabinet/honourable-pablo-rodriguez'],
  },
  {
    title: 'Bill Blair',
    subheader: 'Minister of Public Safety and Emergency Preparedness',
    description: ['20 November 2019', 'Scarborough Southwest', 'https://pm.gc.ca/en/cabinet/honourable-bill-blair'],
  },
  {
    title: 'Mary Ng',
    subheader: 'Minister of Small Business and Export Promotion' +
        'Minister of International Trade',
    description: ['20 November 2019', 'Markham—Thornhill', 'https://pm.gc.ca/en/cabinet/honourable-mary-ng'],
  },
  {
    title: 'Filomena Tassi',
    subheader: 'Minister of Labour',
    description: ['20 November 2019', 'Hamilton West—Ancaster—Dundas', 'https://pm.gc.ca/en/cabinet/honourable-filomena-tassi'],
  },
  {
    title: 'Jonathan Wilkinson',
    subheader: 'Minister of Environment and Climate Change',
    description: ['20 November 2019', 'North Vancouver', 'https://pm.gc.ca/en/cabinet/honourable-jonathan-wilkinson'],
  },
  {
    title: 'David Lametti',
    subheader: 'Minister of Justice and Attorney General',
    description: ['14 January 2019', 'LaSalle—Émard—Verdun', 'https://pm.gc.ca/en/cabinet/honourable-david-lametti'],
  },
  {
    title: 'Bernadette Jordan',
    subheader: 'Minister of Fisheries, Oceans and the Canadian Coast Guard',
    description: ['20 November 2019', 'South Shore—St. Margarets', 'https://pm.gc.ca/en/cabinet/honourable-bernadette-jordan'],
  },  {
    title: 'Joyce Murray',
    subheader: 'Minister of Digital Government',
    description: ['18 March 2019', 'Vancouver Quadra', 'https://pm.gc.ca/en/cabinet/honourable-joyce-murray'],
  },
  {
    title: 'Anita Anand',
    subheader: 'Minister of Public Services and Procurement',
    description: ['20 November 2019', 'Oakville', 'https://pm.gc.ca/en/cabinet/honourable-anita-anand'],
  },
  {
    title: 'Mona Fortier',
    subheader: 'Minister of Middle Class Prosperity' +
        'Associate Minister of Finance',
    description: ['20 November 2019', 'Ottawa—Vanier', 'https://pm.gc.ca/en/cabinet/honourable-mona-fortier'],
  },
  {
    title: 'Steven Guilbeault',
    subheader: 'Minister of Canadian Heritage',
    description: ['20 November 2019', 'Laurier—Sainte-Marie', 'https://pm.gc.ca/en/cabinet/honourable-steven-guilbeault'],
  },
  {
    title: 'Marco Mendicino',
    subheader: 'Minister of Immigration, Refugees and Citizenship',
    description: ['20 November 2019', 'Eglinton—Lawrence', 'https://pm.gc.ca/en/cabinet/honourable-marco-e-l-mendicino'],
  },
  {
    title: 'Marc Miller',
    subheader: 'Minister of Indigenous Services',
    description: ['20 November 2019', 'Ville-Marie—Le Sud-Ouest—Île-des-Sœurs', 'https://pm.gc.ca/en/cabinet/honourable-marc-miller'],
  },
  {
    title: 'Deb Schulte',
    subheader: 'Minister of Seniors',
    description: ['20 November 2019', 'King—Vaughan', 'https://pm.gc.ca/en/cabinet/honourable-deb-schulte'],
  },
  {
    title: 'Dan Vandal',
    subheader: 'Minister of Northern Affairs',
    description: ['20 November 2019', 'Saint Boniface—Saint Vital', 'https://pm.gc.ca/en/cabinet/honourable-dan-vandal'],
  },

];

export default function GeneralDashboard() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [ministerOpen, setMinisterOpen] = React.useState(false);
  const [currentMinister, setCurrentMinister] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMinisterClickOpen = (value) => {
    setMinisterOpen(true);
    setCurrentMinister(value)
    console.log(value)
  };

  const handleMinisterClose = () => {
    setMinisterOpen(false);
  };

  return (
      <Grid>
        <CssBaseline />
        <Container maxWidth="sm" component="main" className={classes.heroContent}>
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Your Government
          </Typography>
        </Container>
        <Container maxWidth="md" component="main">
          <Grid container >
            <Grid item xs={4}>
              <Typography variant="h5" color="textPrimary" >
                Current Government
              </Typography>
              <Typography variant="h4" color="textPrimary" >
                <span className={classes.navbarCustomFont}>Liberal Minority </span><HelpIcon className={classes.help} color="primary" onClick={handleClickOpen}/>
              </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="h5" color="textPrimary" gutterBottom>
                  Seats in Parliament
                </Typography>
                <Grid container>
                  <Grid item xs={9}>
                    {Array.apply(null, { length: 31 }).map((e, i) => (
                        <span key={i}><FiberManualRecordIcon style={{ fontSize: 30, color:'#D71921'}} /></span>))}
                    {Array.apply(null, { length: 24 }).map((e, i) => (
                        <span key={i}><FiberManualRecordIcon style={{ fontSize: 30, color:'#0C499C'}} /></span>))}
                    {Array.apply(null, { length: 6  }).map((e, i) => (
                        <span key={i}><FiberManualRecordIcon style={{ fontSize: 30, color:'#02819E'}} /></span>))}
                    {Array.apply(null, { length: 5 }).map((e, i) => (
                        <span key={i}><FiberManualRecordIcon style={{ fontSize: 30, color:'#EF7E52'}} /></span>))}
                    <FiberManualRecordIcon style={{ fontSize: 30, color:'#2E8724'}} />
                    <FiberManualRecordIcon style={{ fontSize: 30, color:'black'}} />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="textPrimary">
                      <span style={{color:'#43D0C4'}}>Total</span> 338
                    </Typography>
                    <Typography variant="body2" color="textPrimary" >
                      <span style={{ color:'#D71921', fontWeight:'bold'}}>Liberal</span> 157
                    </Typography>
                    <Typography variant="body2" color="textPrimary" >
                      <span style={{ color:'#0C499C', fontWeight:'bold'}}>Conservative</span> 121
                    </Typography>
                    <Typography variant="body2" color="textPrimary" >
                      <span style={{ color:'#02819E', fontWeight:'bold'}}>Bloc Quebecois</span> 32
                    </Typography>
                    <Typography variant="body2" color="textPrimary" >
                      <span style={{ color:'#EF7E52', fontWeight:'bold'}}>NDP</span> 24
                    </Typography>
                    <Typography variant="body2" color="textPrimary" >
                      <span style={{ color:'#2E8724', fontWeight:'bold'}}>Green</span> 3
                    </Typography>
                    <Typography variant="body2" color="textPrimary" >
                      <span style={{ fontWeight:'bold'}}>Independent</span> 1
                    </Typography>
                  </Grid>
                </Grid>
            </Grid>
          </Grid>
        </Container>
        <Container className={classes.prime}>
          <Card>
            <CardHeader
                title="Justin Trudeau"
                subheader="Prime Minister"
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                className={classes.cardHeader}
            />
            <CardContent>
              <div className={classes.cardPricing}>
                <RepresentativeImage representativeToLoad='justin trudeau' />
              </div>
              <ul>
                <Typography component="li" variant="subtitle1" align="center" >
                  <span style={{fontWeight:'bold'}}>Year Elected</span> 2019
                </Typography>
                <Typography component="li" variant="subtitle1" align="center" >
                  <span style={{fontWeight:'bold'}}>Riding</span> Papineau
                </Typography>
                <Typography component="li" variant="subtitle1" align="center" >
                  <Link href='https://pm.gc.ca/en/cabinet/right-honourable-justin-trudeau'>More information</Link>
                </Typography>
              </ul>
            </CardContent>
          </Card>
        </Container>
        <Container>
          <Grid container spacing={5} alignItems="flex-end">
            {ministers.map(minister => (
                <Grid item key={minister.title} xs={4}>
                  <Card>
                    <CardHeader
                        title={minister.title}
                        subheader={minister.subheader}
                        titleTypographyProps={{ align: 'center' }}
                        subheaderTypographyProps={{ align: 'center' }}
                        action=<HelpIcon style={{cursor:'pointer'}} onClick={() => handleMinisterClickOpen(minister.title)}/>
                        className={classes.cardHeader}
                    />
                    <CardContent>
                      <div className={classes.cardPricing}>
                        <RepresentativeImage representativeToLoad={minister.title.toLowerCase()}/>
                      </div>
                      <ul>
                        <Typography component="li" variant="subtitle1" align="center" >
                          <span style={{fontWeight:'bold'}}>Minister Since</span> {minister.description[0]}
                        </Typography>
                        <Typography component="li" variant="subtitle1" align="center" >
                          <span style={{fontWeight:'bold'}}>Riding</span> {minister.description[1]}
                        </Typography>
                        <Typography component="li" variant="subtitle1" align="center" >
                          <Link href={minister.description[2]}>More information</Link>
                        </Typography>
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>
            ))}
          </Grid>
        </Container>
        <MinisterHelpDialog  minister={currentMinister} open={ministerOpen} onClose={handleMinisterClose} transition={Transition} />
        <Dialog
            open={open}
            TransitionComponent={Transition}
            onClose={handleClose}
        >
          <DialogTitle >{"What is a minority government?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              In Canada's parliamentary system of responsible government, minority governments occur when no party has a majority of seats in the legislature.
              Typically, but not necessarily, the party with a plurality of seats forms the government.
              In a minority situation, governments must rely on the support of other parties to stay in power, providing less stability than a majority government.
              In Canada, political parties rarely form official coalition governments to form a majority.
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Grid>
  );
}