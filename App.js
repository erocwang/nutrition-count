import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Amplify, {Auth} from 'aws-amplify';
import {API, graphqlOperation} from 'aws-amplify'
import awsconfig from './aws-exports'; 
import {withAuthenticator} from 'aws-amplify-react-native';
import {createUserInfo, updateUserInfo} from './graphql/mutations'
import {listUserInfos} from './graphql/queries'

Amplify.configure(awsconfig); 

const initialState = {calories: '', carbs: '', proteins: '', fats: ''}

function App() {
  const [formState, setFormState] = useState(initialState)
  const [userInfo, setUserInfo] = useState([])

  useEffect(() => {
    fetchUserInfo()
  }, [])

  function setInput(key,value) {
    setFormState({...formState, [key]:value})
  }

  async function fetchUserInfo() {
    try {
      const userInfoData = await API.graphql(graphqlOperation(listUserInfos))
      var userInfoTemp = userInfoData.data.listUserInfos.items
      if(userInfoTemp.length==0) {
        const userInfo = {...formState}
        await API.graphql(graphqlOperation(createUserInfo, {input: userInfo}))
      }
      else {
        const userInfo = userInfoTemp[0];
        setUserInfo(userInfo)
      }
    } catch (err) { console.log('error fetching userInfo') }
  }

  async function changeUserInfo() {
    try {
      var id = userInfo.id 
      var temp = {id,...formState}
      setUserInfo(temp) 
      await API.graphql(graphqlOperation(updateUserInfo, {input: temp}))
    } catch (err) {
      console.log('error updating userInfo:', err)
    }
  }

  async function signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={val => setInput('calories', val)}
        keyboardType = 'numeric'
        style={styles.input}
        value={formState.calories}
        placeholder="Calories"
      />
      <TextInput
        onChangeText={val => setInput('carbs', val)}
        keyboardType = 'numeric'
        style={styles.input}
        value={formState.carbs}
        placeholder="Carbs"
      />
      <TextInput
        onChangeText={val => setInput('proteins', val)}
        keyboardType = 'numeric'
        style={styles.input}
        value={formState.proteins}
        placeholder="Proteins"
      />
      <TextInput
        onChangeText={val => setInput('fats', val)}
        keyboardType = 'numeric'
        style={styles.input}
        value={formState.fats}
        placeholder="Fats"
      />
      
      <Button title="Update Macros" onPress={changeUserInfo} />
        <View style={styles.todo}>
          <Text>Calories: {userInfo.calories}</Text>
          <Text>Carbs: {userInfo.carbs}</Text>
          <Text>Proteins: {userInfo.proteins}</Text>
          <Text>Fats: {userInfo.fats}</Text>
        </View>
      <Button title="Sign Out" color="tomato" onPress={signOut} />
    </View>
  );
}

export default withAuthenticator(App); 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todo: {
    marginBottom: 15
  },
  input: {
    height:50,
    backgroundColor: '#ddd',
    marginBottom: 10, 
    padding: 8
  }, 
  todoName: {
    fontSize: 18
  }
});