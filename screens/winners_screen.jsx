import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { customHeaderOptions } from '../utilities/headerUtils';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const WinnersScreen = ({ navigation, route }) => {
  const [winners, setWinners] = useState([]);
  const winnerId = route.params?.winnerId;

  useLayoutEffect(() => {
    navigation.setOptions(customHeaderOptions);
  }, [navigation]);

  useEffect(() => {
    const fetchWinners = async () => {
      const firestore = getFirestore();
      const competitionsCollection = collection(firestore, 'competitions');
      const competitionsSnapshot = await getDocs(competitionsCollection);
      const winnersList = competitionsSnapshot.docs
        .filter(doc => doc.data().status === 'closed' && doc.data().winner)
        .map(doc => ({
          id: doc.id,
          competitionType: doc.data().competitionType,
          winnerId: doc.data().winner,
        }));
      setWinners(winnersList);
    };

    fetchWinners();
  }, []);

  const renderWinner = ({ item }) => (
    <View style={[styles.winnerContainer, item.winnerId === winnerId && styles.highlighted]}>
      <Text style={styles.winnerText}>{`Competition: ${item.competitionType}`}</Text>
      <Text style={styles.winnerText}>{`Winner: ${item.winnerId}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Past Competition Winners</Text>
      <FlatList
        data={winners}
        renderItem={renderWinner}
        keyExtractor={item => item.id}
        extraData={winnerId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  winnerContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  winnerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  highlighted: {
    backgroundColor: '#d4edda',
    borderColor: '#388e3c',
    borderWidth: 2,
  },
});

export default WinnersScreen;
