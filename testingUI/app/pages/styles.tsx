import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  titleText: {
    color: "white",
    fontSize: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  button: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 3,
    backgroundColor: "green",
    width: "50%",
    alignItems: "center",
  },
  imgBackground: {
    justifyContent: "center",
    flex: 1,
    width: null,
    height: null,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "green",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "white",
    marginLeft: "10%",
    width: "80%",
    height: 200,
  },
  menu: {
    alignItems: "center",
    marginBottom: 30,
  },
  scenarioButton: {
    borderRadius: 50,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
  },
  scenarioButtonIcon: {
    height: 50,
    width: 50,
  },
});

export default styles;
