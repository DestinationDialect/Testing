import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  // Login styles ------------------------------------------
  imgBackground: {
    justifyContent: "center",
    flex: 1,
    width: null,
    height: null,
  },
  loginContainer: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  Button: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 3,
    backgroundColor: "green",
    alignItems: "center",
  },
  Text: {
    color: "white", 
  },
  input: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 3,
    backgroundColor: "white",
    alignItems: "center",
  },
  container: {
    paddingVertical: 24,
  // Settings Styles -------------------------------------
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1d1d1d", 
  },
  section: {
    paddingTop: 32,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1d1d1d",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  rowWrapper: {
    paddingLeft: 24,
    borderTopWidth: 1,
    borderColor: "white",
    backgroundColor: "green",
    padding: 3,
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
  },
  row: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 24,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "500",
    color: "white",
  },
  rowSpacer: {
    flex: 1,
  },
  rowValue: {
    fontSize: 17,
    color: "black",
    marginRight: 4,
  },
  sectionBody: {
    // paddingLeft: 24,
    borderTopWidth: 1,
    borderColor: "#e3e3e3",
    backgroundColor: "#ffffff",
  // ----------------------------------------------------------
  },
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
  scenarioButtonIcon: {
    height: 100,
    width: 100,
    resizeMode: "contain",
    marginBottom: 60,
    marginLeft: 20,
    marginRight: 10,
  },
  backButtonIcon: {
    margin: 20,
    height: 30,
    width: 30,
  },
  scroller: {
    flexGrow: 1,
  },
  airport: {
    marginTop: 700,
    marginLeft: 20,
  },
  scenarioTextContainer: {
    paddingVertical: 20,
    backgroundColor: "green",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "white",
    alignItems: "center",
    margin: 20,
  },
  scenarioText: {
    color: "white",
  },
});
export default styles;
