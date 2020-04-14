import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import HelpIcon from '@material-ui/icons/Help'
import Container from '@material-ui/core/Container'
import React from 'react'
import { titleCase } from '../Utilities/CommonUsedFunctions'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import Box from '@material-ui/core/Box'

const capitalize = require('capitalize')

const rowsPrototype = [
  { count: 27, empty: 2, colours: [] },
  { count: 28, empty: 0, colours: [] },
  { count: 28, empty: 0, colours: [] },
  { count: 29, empty: 0, colours: [] },
  { count: 30, empty: 0, colours: [] },
  { count: 32, empty: 0, colours: [] },
  { count: 32, empty: 32, colours: [] },
  { count: 32, empty: 0, colours: [] },
  { count: 30, empty: 0, colours: [] },
  { count: 29, empty: 0, colours: [] },
  { count: 28, empty: 0, colours: [] },
  { count: 28, empty: 0, colours: [] },
  { count: 27, empty: 5, colours: [] }
]
const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

function SeatingPlanHelpDialog (props) {
  return (
    <span>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        onClose={() => {
          props.setOpen(false)
        }}
      >
        <DialogTitle>What is a {props.parties.status} government?</DialogTitle>
        <DialogContent>
          {props.parties.status === 'Minority' ? (
            <span>
              <Typography>In Canada, the party that wins a plurality of seats is invited to form the Government by the Governor-General.</Typography>
              <br />
              <Typography>Minority governments occur when no party has a majority of seats in the House of Commons.</Typography>
              <br />
              <Typography>Minority governments rely on the cooperation of other parties to pass legislation and to fulfill other governmental functions.</Typography>
              <br />
              <Typography>While not unheard-of, it is uncommon for parties in Canada to govern cooperatively in a coalition government.</Typography>
              <br />
            </span>
          ) : (
            <span>
              <Typography>In Canada, the party that wins a plurality of seats is invited to form the Government by the Governor-General.</Typography>
              <br />
              <Typography>Minority governments occur when no party has a strict majority of seats in the House of Commons.</Typography>
              <br />
              <Typography>Majority governments can pass legislation and to fulfill other governmental functions without cooperation from other parties</Typography>
              <br />
            </span>
          )}
        </DialogContent>
      </Dialog>
    </span>
  )
}

export default function SeatingPlan (props) {
  const [parties, setParties] = React.useState([])
  React.useEffect(() => {
    if (props.partiesToUse && parties.length === 0) {
      const prties = props.partiesToUse.filter(party => {
        return party.seats
      }).sort((a, b) => {
        if (a.seats > b.seats) return -1
        if (a.seats < b.seats) return 1
        return 0
      })
      prties.forEach(party => {
        if (party.name === 'ndp') {
          party.name = 'New Democratic Party'
        }
      })
      setParties(prties)
    }
  }, [props.partiesToUse, parties])

  const [rows, setRows] = React.useState([])
  React.useEffect(() => {
    if (rows.length === 0 && parties.length > 0) {
      const colours = Object.values(parties).map(party => {
        return Array(party.proportionalSeats).fill(party.color)
      }).flat()
      rowsPrototype.forEach(row => {
        if (row.count - row.empty > 0) {
          row.colours.push(...colours.splice(0, row.count - row.empty))
        }
        if (row.empty > 0) {
          row.colours.push(...Array(row.empty).fill('white'))
        }
      })
      setRows(rowsPrototype)
    }
  }, [parties, rows])

  const [open, setOpen] = React.useState(false)

  return (
    <Container maxWidth='md' component='main' my={20}>
      {rows.length > 0 && props.partiesToUse ? (
        <Grid container direction='column' justify='left' alignItems='left'>
          <Grid item xs={10}>
            <Typography variant='h4' color='textPrimary' pb={20}>
              <span
                style={{ fontWeight: 'bold', color: props.partiesToUse.current.color }}
              >
                {titleCase(props.partiesToUse.current.name)} {props.partiesToUse.status}
              </span>
              <HelpIcon
                className={props.classes.help}
                color='primary'
                onClick={() => { setOpen(true) }}
              />
              <SeatingPlanHelpDialog
                classes={props.classes}
                parties={props.partiesToUse}
                setOpen={setOpen}
                open={open}
              />
            </Typography>
          </Grid>
          <Grid item xs={30}>
            <Typography variant='h5' color='textPrimary' gutterBottom>Seats in Parliament</Typography>
            <Grid container direction='row' spacing={2}>
              <Grid item md={3} my={2}>
                <div>
                  {parties.map((party) =>
                    <Typography key={party.name} variant='body2' color='textPrimary' my={2}>
                      <span style={{ color: party.color, fontWeight: 'bold' }}>
                        {capitalize.words(party.name)}
                      </span>
                      <span style={{ color: party.color }}>
                        {' ' + party.seats}
                      </span>
                    </Typography>
                  )}
                </div>
              </Grid>
              <Grid item xs={27}>
                <Box
                  component='div'
                  display={{ xs: 'none', sm: 'none', md: 'block' }}
                >
                  {rows.map((row, i) =>
                    <Grid container key={i} justify='flex-start' alignItems='center' direction='row'>
                      {Array.apply(null, { length: row.colours.length }).map((e, i) => (
                        <Grid item key={i}>
                          <FiberManualRecordIcon style={{ fontSize: 15, color: (row.colours[i]) }} />
                        </Grid>))}
                    </Grid>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <div>''</div>
      )}
    </Container>
  )
}
