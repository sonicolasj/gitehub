import React from 'react'
import {
    Text,
    View,
    ActivityIndicator,
    Vibration,
    Share,
    StyleSheet
} from 'react-native'


import SearchForm from './components/SearchForm'

export default class GiteHub extends React.Component {
    constructor() {
        super();

        this.state = {
            searchData: {
                location: "None",
                guests: 0,
                checkin: "None",
                checkout: "None"
            }
        }

        this.onSearchFormSubmit = this.onSearchFormSubmit.bind(this);
    }

    render() {
        return (
            <View>
                <Text>GiteHub</Text>
                <SearchForm onSubmit={this.onSearchFormSubmit} /> 
            </View>
        );
    }

    onSearchFormSubmit(searchData) {
        console.log(searchData);
    }
}