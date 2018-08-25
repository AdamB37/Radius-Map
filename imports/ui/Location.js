import React, {Component} from 'react'
import {ListGroupItem} from 'react-bootstrap'

export default class Location extends Component {
   renderLocation() {
      let location = this.props.location
      return (
         <ListGroupItem>
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

   render() {
      return (
         this.renderLocation()
      )
   }
}
