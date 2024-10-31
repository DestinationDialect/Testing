import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useState } from "react";
import styles from "./Styles";
import FeatherIcon from "react-native-vector-icons/Feather";

interface SettingItem {
  id: string;
  icon: string;
  label: string;
  type: "select" | "toggle" | "link";
}

interface Sections {
  header: string;
  items: SettingItem[];
}

const SECTIONS: Sections[] = [
  {
    header: "Preferences",
    items: [
      { id: "language", icon: "globe", label: "Language", type: "select" },
      { id: "darkMode", icon: "moon", label: "Dark Mode", type: "toggle" },
      {
        id: "backgroundMusic",
        icon: "headphones",
        label: "Background Music",
        type: "toggle",
      },
      {
        id: "buttonSound",
        icon: "volume-2",
        label: "Button Sound",
        type: "toggle",
      },
      {
        id: "notifications",
        icon: "message-circle",
        label: "Notifications",
        type: "toggle",
      },
    ],
  },
  {
    header: "Help",
    items: [
      { id: "bug", icon: "flag", label: "Bug Report", type: "link" },
      { id: "contact", icon: "mail", label: "Contact Us", type: "link" },
    ],
  },
];

interface FormState {
  darkMode: boolean;
  language: string;
  backgroundMusic: boolean;
  buttonSound: boolean;
  notifications: boolean;
}

export default function Settings() {
  const [form, setForm] = useState<FormState>({
    darkMode: true,
    language: "English",
    backgroundMusic: true,
    buttonSound: true,
    notifications: true,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Update your Preferences Here</Text>
        </View>

        {SECTIONS.map(({ header, items }) => (
          <View style={styles.section} key={header}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{header}</Text>
            </View>

            <View style={styles.sectionBody}>
              {items.map(({ label, id, type, icon }, index) => (
                <View
                  style={[
                    styles.rowWrapper,
                    index === 0 && { borderTopWidth: 0 },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      //handle onPress
                    }}
                    key={id}
                  >
                    <View style={styles.row}>
                      <FeatherIcon
                        name={icon}
                        color="#a61616"
                        size={22}
                        style={{ marginRight: 12 }}
                      />
                      <Text style={styles.rowLabel}>{label}</Text>

                      <View style={styles.rowSpacer} />

                      {type === "select" && (
                        <Text style={styles.rowValue}>
                          {form[id as keyof FormState]}
                        </Text>
                      )}

                      {type === "toggle" && (
                        <Switch
                          value={Boolean(form[id as keyof FormState])}
                          onValueChange={(value) =>
                            setForm({ ...form, [id as keyof FormState]: value })
                          }
                        />
                      )}

                      {["select", "link"].includes(type) && (
                        <FeatherIcon
                          name="chevron-right"
                          color="#ababab"
                          size={22}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
