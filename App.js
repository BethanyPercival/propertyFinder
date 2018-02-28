'use strict'

import React from 'react';
import SearchPage from './SearchPage';
import SearchResults from './SearchResults';
import { Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';


const instructions = Platform.select({

});

const App = StackNavigator({
    Home: { screen: SearchPage },
    Results: { screen: SearchResults},
});
export default App;
