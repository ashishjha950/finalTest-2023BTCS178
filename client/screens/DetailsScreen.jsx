import React from 'react';
import { View, Text } from 'react-native';

export default function DetailsScreen({ route }) {
  const { userName } = route.params || {};
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      {userName && <Text>User: {userName}</Text>}
    </View>
  );
}