import {
  View,
  StyleSheet
} from 'react-native';
import ToDo from './ToDo';

const App = () => {
  return (
    <View style={styles.container}>
      <ToDo></ToDo>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 100,
    marginBottom: 90
  },
});