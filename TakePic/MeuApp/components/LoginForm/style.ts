import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'lightgray'
  },
  button: {
    color: "white",
    backgroundColor: "hotpink",
    paddingHorizontal: 20,
    paddingVertical: 5,
    textAlign: "center",
    alignSelf: "flex-start",
    fontWeight: "bold",
    borderRadius: 5,
    marginTop: 5
  }
});

export default styles;
