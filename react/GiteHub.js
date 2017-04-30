import React from 'react'
import {
    Text,
    View,
    ActivityIndicator,
    Vibration,
    Share,
    StyleSheet
} from 'react-native'

import DataService from './services/DataService'

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
            },
            results: []
        }

        this.onSearchFormSubmit = this.onSearchFormSubmit.bind(this);
        this.onDataReceived = this.onDataReceived.bind(this);
    }

    render() {
        return (
            <View>
                <Text>GiteHub</Text>
                <SearchForm onSubmit={this.onSearchFormSubmit} /> 

                {this.state.results.map(result => {
                    return <Text>{result.listing.name}</Text>;
                })}
            </View>
        );
    }

    onSearchFormSubmit(searchData) {
        DataService.search(searchData).then(this.onDataReceived);
    }

    onDataReceived(results) {
        this.setState({ results });
    }
}