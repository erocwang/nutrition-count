import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Amplify, {Auth} from 'aws-amplify';
import {API, graphqlOperation} from 'aws-amplify'
import awsconfig from './aws-exports'; 
import {withAuthenticator} from 'aws-amplify-react-native';
import {createTodo} from './graphql/mutations'
import {listTodos} from './graphql/queries'

Amplify.configure(awsconfig); 

const initialState = {name: '', description: ''}

function App() {
  const [text1, setText1] = useState(''); 
  const [text2, setText2] = useState(''); 
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos()
  }, [])

  function setInput(key,value) {
    setFormState({...formState, [key]:value})
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
    try {
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
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
        onChangeText={val => setInput('name', val)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <TextInput
        onChangeText={val => setInput('description', val)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <Button title="Create Todo" onPress={addTodo} />
      {
        todos.map((todo, index) => (
          <View key={todo.id ? todo.id : index} style={styles.todo}>
            <Text style={styles.todoName}>{todo.name}</Text>
            <Text>{todo.description}</Text>
          </View>
        ))
      }
      <Text>Balories</Text>
      <StatusBar style="auto" />
      <TextInput
        style={{height: 40}}
        placeholder="Type here to translate!"
        onChangeText={text1 => setText1(text1)}
        defaultValue={text1}
      />
      <Text style={{padding: 10, fontSize: 42}}>
        {text1.split(' ').map((word) => word && 'FUCKBORT').join(' ')}
      </Text>
      <Text>Fats</Text> 
      <TextInput
        style={{height: 40}}
        placeholder="Type here to translate!"
        onChangeText={text2 => setText2(text2)}
        defaultValue={text2}
      />
      <Text style={{padding: 10, fontSize: 42}}>
        {text2.split(' ').map((word) => word && 'FUCKBORT').join(' ')}
      </Text>
      <Text>💙 + 💛 = React Native + Amplify </Text>
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