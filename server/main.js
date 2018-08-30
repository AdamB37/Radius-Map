import { Meteor } from 'meteor/meteor';
import { LocationsCollection } from '../imports/api/locations'
const addresses = JSON.parse(Assets.getText('assets/addresses.json'))

Meteor.startup(() => {
   let promise

   if (LocationsCollection.find({}).fetch().length) {
      promise = LocationsCollection.rawCollection().drop()
   }
   else {
      promise = Promise.resolve()
   }

   promise
   .then(() => {
      addresses.forEach(address => {
         LocationsCollection.insert(address)
      })
   })
   .catch((err) => {
      console.error(Error(err))
   })
})
