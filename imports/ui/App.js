import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {
   FormGroup,
   FormControl,
   ControlLabel,
   Button,
   ListGroup,
   Form,
   Navbar,
   Label
} from 'react-bootstrap'

import GoogleMapReact from 'google-map-react'
import { withTracker } from 'meteor/react-meteor-data'
import {createClient} from '@google/maps'

import { LocationsCollection } from '../api/locations'

import Locations from './Locations.js'

const API_KEY = "AIzaSyA2PK1mFgnSydbxuT2JuxEF35q6b8K5c_g"
const googleMapsClient = createClient({
  key: API_KEY,
  rate: {limit: 50},
  Promise: Promise
})



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
         zoom: 11,
      }

      this.mapUpdating = false

      this.setLocation = this.setLocation.bind(this)
      this.setDistance = this.setDistance.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
      this.initMarker = this.initMarker.bind(this)
      this.updateMarker = this.updateMarker.bind(this)
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

   initMarker(map, maps) {
      this.setState({
         marker: new maps.Marker({
            position: this.state.location,
            map,
            title: this.state.address
         }),
         map: map,
         maps: maps
      })
   }

   updateMarker(lat,lng) {
      if(this.mapUpdating) {
         return
      }

      this.mapUpdating = true

      let {marker, map, maps, location} = this.state
      if(maps) {
         let newLocation
         if(lat,lng) {
            newLocation = new maps.LatLng(lat,lng)
         } else {
            newLocation = new maps.LatLng(location.lat,location.lng)
         }
         marker.setPosition(newLocation)
         map.panTo(newLocation)
      }
      setTimeout(() => {
         this.mapUpdating = false
      }, 200)
   }

   render() {
      return (
         <div className="container">
            <Navbar>
               <Navbar.Header>
                  <Navbar.Brand>Radius Map</Navbar.Brand>
               </Navbar.Header>
            </Navbar>
            <div style={{ height: '70vh', width: '70%' }}>
               <GoogleMapReact
                  bootstrapURLKeys={{key: API_KEY}}
                  defaultCenter={this.state.location}
                  center={this.state.location}
                  defaultZoom={this.state.zoom}
                  onGoogleApiLoaded={({map, maps}) => this.initMarker(map, maps)}
                  onChange={() => this.updateMarker()}
               >
               </GoogleMapReact>
            </div>
            <Form>
               <FormGroup controlId='location'>
                  <h5><Label bsStyle="info">Address:</Label></h5>
                  <FormControl
                     style={{width: '50%'}}
                     type='text'
                     ref="address"
                     placeholder="1600 Amphitheatre Parkway, Mountain View, CA"
                  />
               </FormGroup>
               <FormGroup>
                  <h5><Label bsStyle="info">Distance:</Label></h5>
                  <FormControl
                     style={{width: '25%'}}
                     type='text'
                     ref="distance"
                     placeholder="Enter miles"
                  />
               </FormGroup>
               <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Submit</Button>
            </Form>
            <h3><Label bsStyle="info">Addresses</Label></h3>
            <Locations
               locations={this.props.locations}
               location={this.state.location}
               distance={this.state.distance}
               updateMarker={this.updateMarker}
            />
         </div>
      )
   }
}

export default withTracker(() => {
   return {
      locations: LocationsCollection.find({}).fetch()
   }
})(App)
