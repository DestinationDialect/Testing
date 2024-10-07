import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  imgBackground: {
    justifyContent: "center",
    flex: 1,
    width: null,
    height: null,
  },
  container: {
    paddingVertical: 24,
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
    color: "#929292",
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
    color: "#a7a7a7",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  rowWrapper: {
    paddingLeft: 24,
    borderTopWidth: 1,
    borderColor: "#e3e3e3",
    backgroundColor: "#ffffff",
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
    color: "#000",
  },
  rowSpacer: {
    flex: 1,
  },
  rowValue: {
    fontSize: 17,
    color: "#616161",
    marginRight: 4,
  },
  sectionBody: {
    paddingLeft: 24,
    borderTopWidth: 1,
    borderColor: "#e3e3e3",
    backgroundColor: "#ffffff",
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