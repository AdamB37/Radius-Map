import { Meteor } from 'meteor/meteor';
import { Locations } from '../imports/api/locations'
const addresses = JSON.parse(Assets.getText('assets/addresses.json'))

Meteor.startup(() => {
   Locations.rawCollection().drop()
   addresses.forEach(address => {
      Locations.insert(address)
   })
})
