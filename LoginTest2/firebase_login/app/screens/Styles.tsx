import { StyleSheet, Platform } from "react-native";
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
    //alignItems: "center",
  },
  container: {
    paddingVertical: 24,
    // Settings Styles -------------------------------------
  },
  darkContainer: {
    paddingVertical: 24,
  },
  darkImgBackground: {
    flex: 1,
    width: null,
    height: null,
  },
  darkTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "rgb(241, 236, 215)",
    marginBottom: 6,
  },
  darkSubtitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "rgb(241, 236, 215)",
  },
  darkSectionHeaderText: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgb(241, 236, 215)",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  darkRow: {
    color: "rgb(241, 236, 215)",
  },
  darkRowLabel: {
    fontSize: 17,
    fontWeight: "500",
    color: "rgb(241, 236, 215)",
  },
  darkRowWrapper: {
    paddingLeft: 24,
    borderTopWidth: 2,
    borderColor: "rgb(241, 236, 215)",
    backgroundColor: "darkgreen",
    padding: 3,
    margin: 1,
    borderRadius: 10,
    borderWidth: 2,
  },
  darkFeatherIcon: {
    color: "rgb(241, 236, 215)",
    marginRight: 12,
  },
  darkFeatherArrow: {
    color: "rgb(241, 236, 215)",
    //marginRight: 12,
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
    fontSize: 20,
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
    fontSize: 15,
    fontWeight: "600",
    color: "black",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  rowWrapper: {
    paddingLeft: 24,
    borderTopWidth: 2,
    borderColor: "white",
    backgroundColor: "green",
    padding: 3,
    margin: 1,
    borderRadius: 10,
    borderWidth: 2,
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
    color: "white",
    marginRight: 4,
  },
  featherIcon: {
    color: "white",
    marginRight: 12,
  },
  featherArrow: {
    color: "white",
  },
  sectionBody: {
    backgroundColor: "transparent",
  },
  // Minigames styles ------------------------
  darkTitleText: {
    color: "rgb(241, 236, 215)",
    fontSize: 30,
  },
  darkButtonText: {
    color: "rgb(241, 236, 215)",
    fontSize: 20,
  },
  darkButton: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    borderColor: "rgb(241, 236, 215)",
    borderWidth: 3,
    backgroundColor: "darkgreen",
    width: "50%",
    alignItems: "center",
  },
  darkTitleContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "darkgreen",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "rgb(241, 236, 215)",
    marginLeft: "10%",
    width: "80%",
    height: 200,
  },
  darkMenu: {
    alignItems: "center",
    marginBottom: 30,
  },
  minigamesContainer: {
    justifyContent: "center",
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
  // -----------------------------
  scenarioButtonIcon: {
    height: 100,
    width: 100,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 10,
  },
  scenarioButton: {
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
  speakerIcon: {
    height: 20,
    width: 20,
  },
  //--modal styles--
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },

  //----------------
  darkModalView: {
    width: "80%",
    padding: 20,
    backgroundColor: "rgb(241, 236, 215)",
    borderRadius: 15,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 2px 4px #000",
      },
    }),
  },
  modalView: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 2px 4px #000",
      },
    }),
  },
  //-------------------

  //-------------------
  darkContinueButton: {
    marginTop: 20,
    backgroundColor: "darkgreen",
    padding: 10,
    borderRadius: 5,
  },
  continueButton: {
    marginTop: 20,
    marginHorizontal: 5,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    marginTop: 20,
    marginHorizontal: 5,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  //--------------------

  //--------------------
  darkContinueButtonText: {
    color: "rgb(241, 236, 215)",
  },
  continueButtonText: {
    color: "white",
  },
  //--------------------
  //---language selection modal styles---------
  modalLanguages: {
    flexDirection: "row",
  },
  modalLanguage: {
    margin: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "bold",
  },
  modalLanguageButton: {
    borderRadius: 20,
    backgroundColor: "#d3d3d3",
    margin: 5,
    padding: 5,
  },
  selectedModalLanguageButton: {
    borderRadius: 20,
    backgroundColor: "#d3d3d3",
    margin: 5,
    padding: 5,
    borderWidth: 2,
    borderColor: "#000",
  },

  //------------------
  darkSelectedLanguageText: {
    color: "rgb(241, 236, 215)",
  },
  selectedLanguageText: {
    color: "white",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
export default styles;
