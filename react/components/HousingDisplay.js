import React from 'react'
import {
  Text,
  View,
  Image,
  Button,
  ListView,
  TouchableHighlight,
  StyleSheet
} from 'react-native'

import RNCalendarEvents from 'react-native-calendar-events';

export default class HousingDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.props.housing = this.props.housing || { listing: {}, pricing_quote: {} };

        this.addToCalendar = this.addToCalendar.bind(this);
    }

    render() {
        return (
            <View>
                <Image
                    style={{width: 64, height: 64}}
                    source={{uri: this.props.housing.listing.picture_url}} />

                <Text>{this.props.housing.listing.name}</Text>

                <Button title="Ajouter à l'agenda" onPress={() => this.addToCalendar()} />
            </View>
        );
    }

    addToCalendar() {
        let housing = this.props.housing;

        RNCalendarEvents.saveEvent(housing.listing.name, {
            location: housing.listing.public_address,
            startDate: housing.pricing_quote.check_in,
            endDate: housing.pricing_quote.check_out
        });
    }
}