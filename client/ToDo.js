import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
} from 'react-native';
import axios from 'axios';
import binIcon from './assets/trash.png'
import BouncyCheckbox from "react-native-bouncy-checkbox";

const serverURL = 'http://localhost:3000';

export default ToDo = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${serverURL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.log(error);
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (task.trim() !== '') {
      const newTask = { id: Date.now().toString(), text: task.trim(), completed: false };
      try {
        await axios.post(`${serverURL}/tasks`, newTask);
        setTasks([...tasks, newTask]);
        setTask('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const deleteTask = async (id) => {
    if (id !== null & id > 0) {
      try {
        await axios.delete(`${serverURL}/tasks/${id}`);
        setTasks(tasks.filter(t => t.id !== id ));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  }

  const taskCheckedComplete = async (complete, itemId) => {
    try {
      const updatedTask = tasks.find((t) => t.id === itemId);
      updatedTask.completed = complete;
  
      await axios.put(`${serverURL}/tasks/${itemId}`, updatedTask);
  
      const updatedTasks = tasks.map((t) => (t.id === itemId ? updatedTask : t));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error occurred while updating complete state of task: ', error);
    }
  };
  

  return (
    <SafeAreaView style={styles.listContainer}>
      <TextInput
        style={styles.input}
        value={task}
        onChangeText={setTask}
        placeholder="Add a task"
      />
      <TouchableOpacity style={styles.button} onPress={addTask}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
      <View>
        <FlatList
          style={styles.flatList}
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style = {styles.flatListView}>
              {!item.completed ? 
                <Text style={styles.taskItem}>{item.text}</Text> :
                <Text style={styles.taskItemCompleted}>{item.text}</Text>
              }
              <BouncyCheckbox
                style = {styles.checkbox}
                size={25}
                fillColor="blue"
                unfillColor="#FFFFFF"
                isChecked = {item.complete}
               onPress={(isChecked) => taskCheckedComplete(isChecked, item.id)} />
              <TouchableOpacity style={styles.buttonDelete} onPress={() => deleteTask(item.id)}>
                {/* <Text style={styles.buttonText}>Delete</Text> */}
                <Image source={binIcon} style={styles.buttonImage}></Image>
              </TouchableOpacity>
            </View>
          )}
        />
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    marginBottom: 10,
    borderRadius: 7,
    margin: 5,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 7,
    margin: 5,
  },
  taskItem: {
    flex: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 7,
    margin: 5,
  },
  taskItemCompleted: {
    flex: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 7,
    margin: 5,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  checkbox: {
    flex: 1,
    padding: 10,
    margin: 5,
    marginRight: 1
  },
  buttonDelete: {
    flex: 1,
    padding: 10,
    margin: 5,
    marginLeft: 1
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  flatList: {
    marginTop: 12,
  },
  flatListView:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonImage: {
    width: 24, // Set the width and height according to your desired icon size
    height: 24,
  },
});