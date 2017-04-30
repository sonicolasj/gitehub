import React from 'react'
import {
  Text,
  View,
  Image,
  Button,
  Share
} from 'react-native'

import RNCalendarEvents from 'react-native-calendar-events';

export default class HousingDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.props.housing = this.props.housing || { listing: {}, pricing_quote: {} };

        this.addToCalendar = this.addToCalendar.bind(this);
        this.share = this.share.bind(this);
    }

    render() {
        return (
            <View>
                <Image
                    style={{width: 64, height: 64}}
                    source={{uri: this.props.housing.listing.picture_url}} />

                <Text>{this.props.housing.listing.name}</Text>

                <Button title="Ajouter à l'agenda" onPress={() => this.addToCalendar()} />
                <Button title="Partager par SMS" onPress={() => this.share()} />
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

    share() {
        let housing = this.props.housing;
        
        Share.share({
            title: 'Réservation GiteHub',
            message: `Réservation GiteHub\n\nDate de début : ${housing.pricing_quote.check_in}\nDate de fin : ${housing.pricing_quote.check_out}\n\nAdresse : ${housing.listing.public_address}\nDescription : "${housing.listing.name}"`
        });
    }
}