import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import HelpIcon from '@material-ui/icons/Help'
import Container from '@material-ui/core/Container'
import React from 'react'
import { titleCase } from './GeneralDashboard'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'

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
            <DialogContentText>
                In Canada's parliamentary system of responsible government, minority governments occur when no party has a majority of seats in the legislature.
                Typically, but not necessarily, the party with a plurality of seats forms the government.
                In a minority situation, governments must rely on the support of other parties to stay in power, providing less stability than a majority government.
                In Canada, political parties rarely form official coalition governments to form a majority.
            </DialogContentText>
          ) : (
            <DialogContentText>
                A majority government refers to one or multiple governing parties that hold an absolute majority of seats in legislature.
                This is as opposed to a minority government, where the largest party in a legislature only has a plurality of seats.
                A majority government is usually assured of having its legislation passed and rarely, if ever, has to fear being defeated in parliament, a state
                also known as a working majority. In contrast, a minority government must constantly bargain for support from other parties in order to pass
                legislation and avoid being defeated on motions of no confidence.
            </DialogContentText>
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
          <Grid item xs={5}>
            <Typography variant='h5' color='textPrimary' gutterBottom>Seats in Parliament</Typography>
          </Grid>
          <Grid item xs={30}>
            <Grid container direction='row' spacing={2}>
              <Grid item xs={3} my={2}>
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
                {rows.map((row, i) =>
                  <Grid container key={i} justify='flex-start' alignItems='center' direction='row'>
                    {Array.apply(null, { length: row.colours.length }).map((e, i) => (
                      <Grid item key={i}>
                        <FiberManualRecordIcon style={{ fontSize: 15, color: (row.colours[i]) }} />
                      </Grid>))}
                  </Grid>
                )}
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
