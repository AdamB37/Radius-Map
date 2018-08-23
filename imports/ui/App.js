import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { Locations } from '../api/locations'
import { withTracker } from 'meteor/react-meteor-data'
import {createClient} from '@google/maps'
import { Meteor } from 'meteor/meteor';

const googleMapsClient = createClient({
  key: "AIzaSyA2PK1mFgnSydbxuT2JuxEF35q6b8K5c_g",
  rate: {limit: 50}
})

import Location from './Location.js'

class App extends Component {
   constructor(props) {
      super(props)

      this.state = {
         // location: null,
         lat: null,
         long: null,
         distance: 10
      }

     //  googleMapsClient.geocode({
     //    address: '1600 Amphitheatre Parkway, Mountain View, CA'
     // }, function(err, response) {
     //    console.log('err',err)
     //     if (!err) {
     //        console.log('location', response.json.results)
     //     }
     //  })

      this.setUserLocation = this.setUserLocation.bind(this)
      this.setDistance = this.setDistance.bind(this)
   }

   setUserLocation(event) {
      console.log('setUserLocation')
      event.preventDefault()
      // const lat = Number(ReactDOM.findDOMNode(this.refs.lat).value.trim())
      // const long = Number(ReactDOM.findDOMNode(this.refs.long).value.trim())
      let lat, lng
      const location = ReactDOM.findDOMNode(this.refs.location).value.trim()
      // googleMapsClient.geocode({address: location}, (err, res) => {
      //    console.log('err',err)
      //    ({ lat, lng } = res.json.results[0].geometry.location)
      //    console.log('results', res.json.results[0].geometry.location)
      //    this.setState({
      //       lat: lat
      //       long: lng
      //    })
      // })
      // this.setState({lat, long})
   }

   setDistance(event) {
      event.preventDefault()
      const distance =  Number(ReactDOM.findDOMNode(this.refs.distance).value.trim())
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

            <div className="row">
               <form className="change-location" onSubmit={this.setUserLocation}>
                  <input
                     type="text"
                     ref="location"
                     placeholder="location"
                  />
               </form>
               {/* <form className="change-location" onSubmit={this.setUserLocation}>
                  <input
                     type="text"
                     ref="lat"
                     placeholder="Lat"
                  />
               </form>
               <form className="change-location" onSubmit={this.setUserLocation}>
                  <input
                     type="text"
                     ref="long"
                     placeholder="Long"
                  />
               </form> */}
               <form className="change-location" onSubmit={this.setDistance}>
                  <input
                     type="text"
                     ref="distance"
                     placeholder="distance"
                  />
               </form>
            </div>

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
