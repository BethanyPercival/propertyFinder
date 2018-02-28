'use strict'

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    ActivityIndicator,
    Image,
} from 'react-native';
import CheckBox from 'react-native-check-box'

function urlForQueryAndPage(key, value, pageNumber) {
    const data = {
        country: 'uk',
        pretty: '1',
        encoding: 'json',
        listing_type: 'buy',
        action: 'search_listings',
        page: pageNumber,
    };

    data[key] = value;

    const querystring = Object.keys(data)
        .map(key => key + '=' + encodeURIComponent(data[key]))
        .join('&');

    return 'https://api.nestoria.co.uk/api?' + querystring;
}

export default class SearchPage extends Component<{}> {
    static navigationOptions = {
        title: 'Property Finder',
    };

    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            isLoading: false,
            message: '',
            buy: false,
            rent: false,
            share: false,
        };
    }

    _executeQuery = (query) => {
        console.log(query);
        this.setState({isLoading: true});
        fetch(query)
            .then(response => response.json())
            .then(json => this._handleResponse(json.response))
            .catch(error =>
                this.setState({
                    isLoading: false,
                    message: 'Something bad happened ' + error
                })
            );
    };

    _handleResponse = (response) => {
        this.setState({isLoading: false, message: ''});
        if (response.application_response_code.substr(0, 1) === '1') {
            this.props.navigation.navigate(
                'Results', {listings: response.listings}
            );
        } else {
            this.setState({message: 'Location not recognised; please try again.'});
        }
    };

    _onSearchPressed = () => {
        const query = urlForQueryAndPage('place_name', this.state.searchString, 1);
        this._executeQuery(query);
    };

    _onSearchTextChanged = (event) => {
        this.setState({searchString: event.nativeEvent.text});
    };

    _onClickCheckBox = (id) => {
        console.log('_onClickCheckBox');
    }

    render() {
        const spinner = this.state.isLoading ?
            <ActivityIndicator size={'large'}/> : null;

        return (
            <View style={styles.background}>
                <Text style={styles.description}>
                    Please enter your search criteria
                </Text>

                <View style={styles.flowRight}>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={styles.searchInput}
                        placeholder='Enter a search location'
                        onChange={this._onSearchTextChanged}/>

                    <Button
                        onPress={this._onSearchPressed}
                        color='#48BBEC'
                        title='Go'/>
                </View>

                <Text style={styles.heading}>
                    Listing Type
                </Text>

                <View style={styles.flowRight}>
                    <View style={[styles.checkBoxElement, styles.flowRight]}>
                        <Text>Buy</Text>
                        <CheckBox
                            style={styles.checkBox}
                            onClick={this._onClickCheckBox('buy')}/>
                    </View>

                    <View style={[styles.checkBoxElement, styles.flowRight]}>
                        <Text>Rent</Text>
                        <CheckBox
                            style={styles.checkBox}
                            onClick={this._onClickCheckBox('rent')}/>
                    </View>

                    <View style={[styles.checkBoxElement, styles.flowRight]}>
                        <Text>Share</Text>
                        <CheckBox
                            style={styles.checkBox}
                            onClick={this._onClickCheckBox('share')}/>
                    </View>
                </View>

                <Text style={styles.heading}>
                    Price
                </Text>

                <View style={styles.flowRight}>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                    style={styles.userInput}/>

                    <Text style={styles.to}>
                        To
                    </Text>

                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={styles.userInput}/>
                </View>

                {spinner}
                <Text style={styles.description}>{this.state.message}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        padding: 20,
        backgroundColor: '#FAFFFF'
    },
    description: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: '#656565',
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    searchInput: {
        height: 36,
        padding: 6,
        marginRight: 5,
        flexGrow: 1,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#236366',
        borderRadius: 4,
        color: '#0ADDE5',
    },
    image: {
        width: 217,
        height: 138,
    },
    checkBox: {
        paddingLeft: 6,
    },
    checkBoxElement: {
        marginRight: 12,
    },
    heading: {
        fontSize: 20,
        textAlign: 'justify',
        marginTop: 12,
        marginBottom: 12,
    },
    userInput: {
        height: 24,
        padding: 6,
        flexGrow: 1,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#236366',
        borderRadius: 4,
    },
    to: {
        paddingLeft: 6,
        paddingRight: 6,
    }
});