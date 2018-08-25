import React, {Component} from 'react'
import {ListGroup,ListGroupItem} from 'react-bootstrap'

export default class Locations extends Component {
   constructor(props) {
      super(props)

      this.renderLocation = this.renderLocation.bind(this)
      this.renderLocations = this.renderLocations.bind(this)
   }
   calculateDistance(location) {
      const toRad = value => value * Math.PI / 180
      let lat2 = location.latitude
      let lon2 = location.longitude
      let lat1 = this.props.location.lat
      let lon1 = this.props.location.lng
      let R = 3958.7558657440545; // Radius of earth in Miles
      let dLat = toRad(lat2-lat1)
      let dLon = toRad(lon2-lon1)
      let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      let d = R * c
      return d
   }

   renderLocation(location) {
      return (
         <ListGroupItem
            key={location._id}
            onClick={() => this.props.updateMarker(location.latitude, location.longitude)}
         >
            {
               location.street_number + ' '
               + location.route + ', '
               + location.locality + ', '
               + location.administrativeArea + ', '
               + location.country + ', '
               + location.postalCode
            }
         </ListGroupItem>
      )
   }

   renderLocations() {
      let filteredLocations = this.props.locations
      if (this.props.location.lat && this.props.location.lng) {
         filteredLocations = filteredLocations.filter(location => {
            return this.calculateDistance(location) <= this.props.distance
         })
      }
      return filteredLocations.map(this.renderLocation)
   }

   render() {
      return (
         <ListGroup>
            {this.renderLocations()}
         </ListGroup>
      )
   }
}
