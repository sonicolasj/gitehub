import React from 'react'
import { 
    Text,
    View, 
    TextInput, 
    Button,
    StyleSheet 
} from 'react-native'

import DatePicker from 'react-native-datepicker'


export default class SearchForm extends React.Component {
    constructor(props) {
        super(props);

        this.props.onSubmit = this.props.onSubmit || (e => {});

        this.state = {
            location: "Arras",
            guests: 1,
            checkin: "2017-04-30",
            checkout: "2017-05-01"
        };

        this.onButtonPress = this.onButtonPress.bind(this);
    }

    render() {
        return (
            <View>
                <Text>Ville</Text>
                <TextInput 
                    value={this.state.location} 
                    onChangeText={(location) => this.setState({ location })} />

                <Text>Nombre de personnes</Text>
                <TextInput 
                    value={this.state.guests.toString()} 
                    keyboardType="number"
                    onChangeText={(guests) => this.setState({ guests: new Number(guests) })} />

                <Text>Date d'arrivée</Text>
                <DatePicker 
                    date={this.state.checkin} 
                    mode="date"
                    onDateChange={(checkin) => this.setState({ checkin }) } />

                <Text>Date de départ</Text>
                <DatePicker 
                    date={this.state.checkout} 
                    mode="date"
                    onDateChange={(checkout) => this.setState({ checkout }) }/>

                <Button title="Rechercher" onPress={this.onButtonPress} />
            </View>
        );
    }

    onButtonPress(e) {
        this.props.onSubmit(this.state);
    }
}