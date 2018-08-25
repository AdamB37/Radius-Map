import { Meteor } from 'meteor/meteor';
import { LocationsCollection } from '../imports/api/locations'
const addresses = JSON.parse(Assets.getText('assets/addresses.json'))

Meteor.startup(() => {
   LocationsCollection.rawCollection().drop()
   addresses.forEach(address => {
      LocationsCollection.insert(address)
   })
})
