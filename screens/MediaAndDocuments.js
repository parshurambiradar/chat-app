import { FlatList, Modal, SafeAreaView, SectionList, StyleSheet, TouchableOpacity, View, } from 'react-native'
import React, { useState } from 'react'

import { Tab, Text, TabView, Image, Divider, Overlay } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar';
const MediaAndDocuments = () =>
{
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0)
  const toggleImage = (index = 0) =>
  {
    setImageIndex(index)
    setOpen(!open);
  }
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () =>
  {
    setVisible(!visible);
  }
  const renderItem = ({ item, index }) =>
  {
    return (
      <>
        <TouchableOpacity onPress={() => toggleImage(index)}>

          <Image style={{ width: 200, height: 200, margin: 5 }} source={{ uri: item.name }} />
        </TouchableOpacity>
      </>

    )
  }
  return (
    <>

      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: 'lightblue',
          height: 3,
        }}


      >
        <Tab.Item
          title="Media"
          titleStyle={{ fontSize: 12, color: 'black' }}

        // icon={{ name: 'timer', type: 'ionicon', color: 'white' }}
        />
        <Tab.Item
          title="Documents"
          titleStyle={{ fontSize: 12, color: 'black' }}

        // icon={{ name: 'heart', type: 'ionicon', color: 'white' }}
        />
        <Tab.Item
          title="Links"
          titleStyle={{ fontSize: 12, color: 'black' }}

        // icon={{ name: 'heart', type: 'ionicon', color: 'white' }}
        />

      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring"  >
        <TabView.Item style={{ backgroundColor: 'white', width: '100%', }}>
          <View>

            <FlatList
              style={{}}
              contentContainerStyle={{

                margin: 10
              }}
              numColumns={2}
              keyExtractor={(item) => item.id}
              data={media}
              renderItem={renderItem}

            />
          </View>
        </TabView.Item>
        <TabView.Item style={{ backgroundColor: 'white', width: '100%', }}>
          <View style={styles.container}>
            <FlatList
              style={{}}
              keyExtractor={(item) => item.id}
              data={documents}
              renderItem={({ item: { name } }) => (
                <>

                  <View style={{ margin: 10, padding: 5, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', }}>
                    <Ionicons name={'document'} size={24} />
                    <Text style={{ marginLeft: 10 }}>{name}</Text>

                  </View>
                  <Divider color='black' />
                </>
              )}
              ListHeaderComponent={<HeaderTitle title={"Recent"} />}
            />

          </View>

        </TabView.Item>
        <TabView.Item style={{ backgroundColor: 'white', width: '100%', }}>
          <View>
            <Text>Links</Text>
          </View>
        </TabView.Item>
      </TabView>
      <Modal
        visible={open}

        onRequestClose={toggleImage}

      >

        <View style={{ backgroundColor: '#282828', flex: 1, justifyContent: 'space-between' }}>
          {/* header */}
          <View style={{ margin: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={toggleImage}>
              <Ionicons name='arrow-back' color={'white'} size={28} />
            </TouchableOpacity>
            <Text h4 h4Style={{ color: 'white' }}>Image</Text>
            <TouchableOpacity onPress={toggleOverlay}>
              <Ionicons name='ellipsis-vertical' color={'white'} size={28} />
            </TouchableOpacity>
          </View>
          <Image style={{ height: 400, margin: 5, }} source={{ uri: media?.[imageIndex]?.name }} />
          <View />
        </View>
      </Modal>
      <Overlay
        overlayStyle={{
          position: 'absolute',
          right: 10,
          top: 60,
          width: '50%',
        }}
        isVisible={visible}
        onBackdropPress={toggleOverlay}>
        <View>
          <TouchableOpacity >

            <Text style={styles.label} numberOfLines={1}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity >
            <Text style={styles.label} >Save </Text>
          </TouchableOpacity>
        </View>

      </Overlay>
    </>
  );
};

export default MediaAndDocuments


const HeaderTitle = ({ title, style }) =>
{
  return <Text style={[{ marginLeft: 16 }, style]} h4>{title}</Text>
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  label: {
    marginBottom: 10,
    padding: 10,
    fontSize: 16
  }
})

const documents = [
  {
    id: "1",
    name: 'Discussion.pdf'
  },
  {
    id: "2",
    name: 'testt.pdf'
  },
  {
    id: "3",
    name: '2313.pdf'
  },
  {
    id: "4",
    name: 'UCLA joining.pdf'
  },

  {
    id: "5",
    name: 'testt.pdf'
  },
  {
    id: "6",
    name: '2313.pdf'
  },
  {
    id: "7",
    name: 'UCLA joining.pdf'
  },


]
const media = [
  {
    id: "1",
    name: 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg'
  },
  {
    id: "2",
    name: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg'
  },
  {
    id: "3",
    name: 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg'
  },
  {
    id: "4",
    name: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg'
  },

]