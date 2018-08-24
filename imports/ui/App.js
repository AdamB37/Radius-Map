import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'

import { Locations } from '../api/locations'
import { withTracker } from 'meteor/react-meteor-data'
import {createClient} from '@google/maps'
import { Meteor } from 'meteor/meteor';

const googleMapsClient = createClient({
  key: "AIzaSyA2PK1mFgnSydbxuT2JuxEF35q6b8K5c_g",
  rate: {limit: 50},
  Promise: Promise
})

import Location from './Location.js'

class App extends Component {
   constructor(props) {
      super(props)

      this.state = {
         address: null,
         lat: null,
         long: null,
         distance: 10
      }

      this.setUserLocation = this.setUserLocation.bind(this)
      this.setDistance = this.setDistance.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
   }

   handleSubmit(event) {
      event.preventDefault()
      console.log('handleSubmit')
      const address = ReactDOM.findDOMNode(this.refs.address).value.trim()
      const distance =  Number(ReactDOM.findDOMNode(this.refs.distance).value.trim())
      if(distance != this.state.distance) {
         this.setDistance(distance)
      }
      if(address != this.state.address) {
         this.setUserLocation(address)
      }

   }

   setUserLocation(address) {
      let lat, lng
      googleMapsClient.geocode({address}).asPromise()
      .then(res => {
         ({ lat, lng } = res.json.results[0].geometry.location)
         this.setState({
            address,
            lat: lat,
            long: lng
         })
      })
      .catch(err => console.log('err',err))
   }

   setDistance(distance) {
      this.setState({distance})
   }

   calculateDistance(location) {
      const toRad = value => value * Math.PI / 180
      let lat2 = location.latitude
      let lon2 = location.longitude
      let lat1 = this.state.lat
      let lon1 = this.state.long
      let R = 3958.7558657440545; // Radius of earth in Miles
      let dLat = toRad(lat2-lat1);
      let dLon = toRad(lon2-lon1);
      let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      let d = R * c;
      return d;
   }


   renderLocations() {
      console.log('state',this.state)
      let filteredLocations = this.props.locations
      if (this.state.lat && this.state.long) {
         filteredLocations = filteredLocations.filter(location => {
            return this.calculateDistance(location) <= this.state.distance
         })
      }
      return filteredLocations.map(location => (
         <Location key={location._id} location={location} />
      ))
   }

   render() {
      return (
         <div className="container">

            <header>Radius Map</header>
            <form>
               <FormGroup controlId='location'>
                  <ControlLabel>Address:</ControlLabel>
                  <FormControl
                     type='text'
                     ref="address"
                  />
                  <ControlLabel>Distance:</ControlLabel>
                  <FormControl
                     type='text'
                     ref="distance"
                  />
                  <Button type="submit" onClick={this.handleSubmit}>Submit</Button>
               </FormGroup>

            </form>
            <ul>
               {this.renderLocations()}
            </ul>

         </div>
      )
   }
}

export default withTracker(() => {
   return {
      locations: Locations.find({}).fetch()
   }
})(App)
