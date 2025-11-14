import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './navigation/MainNavigator';
import { ActivityIndicator } from 'react-native';

const App = () => {
  return (
    <React.Suspense fallback={<ActivityIndicator/>}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </React.Suspense>
  );
};

export default App;
