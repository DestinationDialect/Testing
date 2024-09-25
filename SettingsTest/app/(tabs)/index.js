import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {SafeAreaView, Text, ScrollView, View, TouchableOpacity, Switch} from 'react-native';
import { useEffect, useState } from "react";
import FeatherIcon from 'react-native-vector-icons/Feather';

const SECTIONS = [
  {
    header: 'Preferences',
    items: [
      {id: 'language', icon: 'globe', label:'Language', type:'select' },
      {id: 'darkMode', icon: 'moon', label:'Dark Mode', type:'toggle'},
      {id: 'backgroundMusic', icon: 'headphones', label: "Background Music", type:'toggle'},
      {id: 'buttonSound', icon: 'volume-2', label: "Button Sound", type: 'toggle'},
      {id: 'notifications', icon: 'message-circle', label: "Notifications", type: 'toggle'},
    ]
  },
  {
    header: 'Help',
    items: [
      {id: 'bug', icon: 'flag', label: 'Bug Report', type: 'link'},
      {id: 'contact', icon: 'mail', label: "Contact Us", type: 'link'}
    ]
  }
];

export default function Example(){
  const [form, setForm] = useState({
    darkMode: 'true',
    language: 'English',
    backgroundMusic: 'true',
    buttonSound: 'true',
    notifications: 'true',
  })


  return(
    <SafeAreaView style={{flex:1, backgroundColor:'#f6f6f6'}}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Update your Preferences Here</Text>
        </View>

        {SECTIONS.map(({header, items}) => (
          <View style={styles.section} key={header}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{header}</Text>
            </View>

            <View style={styles.sectionBody}>
              {items.map(( {label, id, type, icon}, index ) => (
                <View style={[styles.rowWrapper, index === 0 && {borderTopWidth:0} ]}>
                <TouchableOpacity onPress={() => {
                  //handle onPress
                }} key={id}>
                  <View style={styles.row}>
                    <FeatherIcon name={icon} color='#a61616' size='22' style={{marginRight:12}}/>
                    <Text style={styles.rowLabel}>{label}</Text>

                    <View style={styles.rowSpacer} />

                    {type === 'select' && (
                      <Text style={styles.rowValue}>{form[id]}</Text>
                    )}

                    {type === 'toggle' && (
                      <Switch value={form[id]} onValueChange={(value) => setForm({...form, [id]:value})} />
                    )}

                    {['select', 'link'].includes(type) && (
                      <FeatherIcon name='chevron-right' color='#ababab' size={22} />
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

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24, 
  },
  header:{
    paddingHorizontal: 24,
    marginBottom:12,
  },
  title:{
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 6, 
  },
  subtitle:{
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  section:{
    paddingTop:32,
  },
  sectionHeader:{
    paddingHorizontal:24,
    paddingVertical:8,
  },
  sectionHeaderText:{
    fontSize: 14,
    fontWeight: '600',
    color: '#a7a7a7',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  rowWrapper:{
    paddingLeft:24, 
    borderTopWidth:1,
    borderColor: '#e3e3e3',
    backgroundColor: '#ffffff',
  },
  row: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    paddingRight: 24,
  },
  rowLabel:{
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
  },
  rowSpacer:{
    flex:1,
  },
  rowValue:{
    fontSize:17,
    color:'#616161',
    marginRight:4,
  },
  sectionBody:{
    paddingLeft:24, 
    borderTopWidth:1,
    borderColor: '#e3e3e3',
    backgroundColor: '#ffffff',
  }
});




/*export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
*/
