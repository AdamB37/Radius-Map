import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {FormGroup, FormControl, ControlLabel, Button, ListGroup, Form} from 'react-bootstrap'
import GoogleMapReact from 'google-map-react';

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
         location : {
            lat: 37.774929,
            lng: -122.419418
         },
         distance: Infinity,
         zoom: 11
      }

      this.setLocation = this.setLocation.bind(this)
      this.setDistance = this.setDistance.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
   }

   handleSubmit(event) {
      event.preventDefault()
      const address = ReactDOM.findDOMNode(this.refs.address).value.trim()
      const distance =  Number(ReactDOM.findDOMNode(this.refs.distance).value.trim())
      if(distance != this.state.distance) {
         this.setDistance(distance)
      }
      if(address != this.state.address) {
         this.setLocation(address)
      }

   }

   setLocation(address) {
      let lat, lng
      googleMapsClient.geocode({address}).asPromise()
      .then(res => {
         ({ lat, lng } = res.json.results[0].geometry.location)
         this.setState({
            address,
            location: {lat, lng}
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
      let lat1 = this.state.location.lat
      let lon1 = this.state.location.lng
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
      if (this.state.location.lat && this.state.location.lng) {
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
            <div style={{ height: '100vh', width: '100%' }}>
               <GoogleMapReact
                  defaultCenter={this.state.location}
                  defaultZoom={this.state.zoom}
               >
                  <ControlLabel>X</ControlLabel>
               </GoogleMapReact>
            </div>
            <Form>
               <FormGroup controlId='location'>
                  <ControlLabel>Address:</ControlLabel>
                  <FormControl
                     style={{width: '50%'}}
                     type='text'
                     ref="address"
                     placeholder="1600 Amphitheatre Parkway, Mountain View, CA"
                  />
               </FormGroup>
               <FormGroup>
                  <ControlLabel>Distance:</ControlLabel>
                  <FormControl
                     style={{width: '25%'}}
                     type='text'
                     ref="distance"
                     placeholder="Enter miles"
                  />
               </FormGroup>
               <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Submit</Button>
            </Form>
            <h1 style={{padding: '10px'}}>Addresses</h1>
            <ListGroup>
               {this.renderLocations()}
            </ListGroup>

         </div>
      )
   }
}

export default withTracker(() => {
   return {
      locations: Locations.find({}).fetch()
   }
})(App)
