import React, {Component} from 'react'

export default class Location extends Component {
   renderLocation() {
      let location = this.props.location
      return (
         <li key={location._id}>
            {
               location.street_number + ' '
               + location.route + ', '
               + location.locality + ', '
               + location.administrativeArea + ', '
               + location.country + ', '
               + location.postalCode
            }
         </li>
      )
   }

   render() {
      return (
         this.renderLocation()
      )

   }
}
