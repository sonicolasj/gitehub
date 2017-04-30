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

export default class HousingDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.props.housing = this.props.housing || { listing: {}, pricing_quote: {} };
    }

    render() {
        return (
            <View>
                <Image
                    style={{width: 64, height: 64}}
                    source={{uri: this.props.housing.listing.picture_url}} />

                <Text>{this.props.housing.listing.name}</Text>
            </View>
        );
    }
}