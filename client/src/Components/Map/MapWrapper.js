// eslint-disable-next-line no-unused-vars
import mapStyling from './Map.css'
import React, { Component } from 'react'
import CanadaMap from './CanadaMap'
import IconButton from '@material-ui/core/IconButton'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import CachedIcon from '@material-ui/icons/Cached'
import Tooltip from '@material-ui/core/Tooltip'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import List from '@material-ui/core/List'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { capitalizedName } from '../Dashboard/Utilities/CommonUsedFunctions'
import PersonIcon from '@material-ui/icons/Person'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import FlagIcon from '@material-ui/icons/Flag'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import Divider from '@material-ui/core/Divider'
import CardHeader from '@material-ui/core/CardHeader'

const stylingRepInfoCard = {
  bigAvatar: {
    marginTop: '5%',
    marginLeft: '30%',
    width: 100,
    height: 100,
    border: '3px'
  },
  stylingIcons: {
    background: '#43D0C4'
  }
}

export default class ChartWrapper extends Component {
  componentDidMount () {
    // eslint-disable-next-line no-new
    new CanadaMap(
      this.props.ridingCodes,
      this.props.shapeData,
      this.props.ridingMpData,
      this.props.handleOpenModal,
      this.props.selectedRiding,
      this.refs.chart
    )
  }

  shouldComponentUpdate (nextProps) {
    return equals(nextProps, this.props)
  }

  render () {
    return (
      <div ref='mapHolder'>
        <div id='map-holder'>
          <Grid container spacing={10}>
            <Grid item xs={8}>
              <div id='map-wrapper'>
                <div className='zoom-buttons'>
                  <div className='zoom-button' id='zoomin'>
                    <Tooltip title='Zoom-In' placement='left'>
                      <IconButton>
                        <AddCircleIcon fontSize='large' />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div
                    className='zoom-button zoombutton-out disable'
                    id='zoomout'
                  >
                    <Tooltip title='Zoom-Out' placement='left'>
                      <IconButton>
                        <RemoveCircleIcon fontSize='large' />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div
                    className='zoom-button zoombutton-out disable'
                    id='reset'
                  >
                    <Tooltip title='Reset to Default' placement='left'>
                      <IconButton>
                        <CachedIcon fontSize='large' />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
                <svg id='map' ref='chart' />
              </div>
            </Grid>
            <Grid item xs={4}>
              {this.props.contents ? (
                <Card borderRadius='borderRadius' borderColor='grey.500' style={{ marginLeft: '20%' }}>
                  <CardHeader
                    style={{ textAlign: 'center' }}
                    title='Representative Info'
                  />
                  <Divider />
                  <Avatar alt={this.props.contents.name} src={this.props.contents.imageUrl} style={stylingRepInfoCard.bigAvatar} />
                  <CardContent>
                    <Divider />
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar style={stylingRepInfoCard.stylingIcons}>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                          <span style={{ fontWeight: 'bold' }}>Name: </span> {capitalizedName(this.props.contents.name)}
                        </ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar style={stylingRepInfoCard.stylingIcons}>
                            <LocationOnIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText><span style={{ fontWeight: 'bold' }}>Riding: </span>{capitalizedName(this.props.contents.riding)}</ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar style={stylingRepInfoCard.stylingIcons}>
                            <FlagIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                          <span style={{ fontWeight: 'bold' }}>Party: </span>{capitalizedName(this.props.contents.party)}
                        </ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar style={stylingRepInfoCard.stylingIcons}>
                            <CalendarTodayIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                          <span style={{ fontWeight: 'bold' }}>Member Since: </span> {this.props.contents.dateEntry}
                        </ListItemText>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>)
                : ('')}

            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}
function equals (nextProps, props) {
  if (nextProps.ridingCodes === props.ridingCodes &&
      nextProps.shapeData === props.shapeData &&
      nextProps.ridingMpData === props.ridingMpData &&
      nextProps.contents === props.contents &&
      nextProps.selectedRiding === props.selectedRiding
  ) {
    return false
  } else { return true }
}
