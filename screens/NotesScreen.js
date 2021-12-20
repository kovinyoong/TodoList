import React, { useState, useEffect, route} from "react";
import {
 StyleSheet,
 Text,
 View,
 FlatList,
 TouchableOpacity,
 Route,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

const db = SQLite.openDatabase("notes.db");
console.log(FileSystem.documentDirectory);

export default function NotesScreen({ navigation, route } ) {
 const [notes, setNotes] = useState([]);

 function refreshNotes() {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM notes",
      null,
      (txObj, { rows: { _array } }) => setNotes(_array),
      (txObj, error) => console.log(`Error: ${error}`)
    );
  });
}


  // This is to set up the database on first run
  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS notes
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          done INT)
        `
        );
      },
      null,
      refreshNotes
    );
  }, []);




  // This is to set up the top right button
 useEffect(() => {
   navigation.setOptions({
     headerRight: () => (
       <TouchableOpacity onPress={addNote}>
         <Entypo
           name="new-message"
           size={24}
           color="black"
           style={{ marginRight: 20 }}
         />
       </TouchableOpacity>
     ),
   });
 });




//   // Monitor route.params for changes and add items to the database
//  useEffect(() => {
//   if (route.params?.text) {
//     db.transaction(
//       (tx) => {
//       tx.executeSql("INSERT INTO notes (done, value) VALUES (0, ?)", [
//         route.params.text,
//       ]);
//     },
//     null,
//     refreshNotes
//     );

//     const newNote = {
//       title: route.params.text,
//       done: false,
//       id: notes.length.toString(),
//     };
//     setNotes([...notes, newNote]);
//   }
// }, [route.params?.text]);

// function addNote() {
//   navigation.navigate("Add Note");
// }




  // Monitor route.params for changes and add items to the database
  useEffect(() => {
    if (route.params?.text) {
      db.transaction(
        (tx) => {
          tx.executeSql("INSERT INTO notes (done, title) VALUES (0, ?)", [
            route.params.text,
          ]);
        },
        null,
        refreshNotes
      );
    }
  }, [route.params?.text]);

  function addNote() {
    navigation.navigate("Add Note");
  }





// This deletes an individual note
function deleteNote(id) {
  console.log("Deleting " + id);
  db.transaction(
    (tx) => {
      tx.executeSql(`DELETE FROM notes WHERE id=${id}`);
    },
    null,
    refreshNotes
  );
}













 // The function to render each row in our FlatList
 function renderItem({ item }) {
   return (
    <View
    style={{
      padding: 10,
      paddingTop: 20,
      paddingBottom: 20,
      borderBottomColor: "#ccc",
      borderBottomWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    }}
  ><Text>{item.title}</Text>
       <TouchableOpacity onPress={() => deleteNote(item.id)}>
          <Entypo name="trash" size={24} color="black" />
        </TouchableOpacity>
     </View>
   );
 }

 return (
  <View style={styles.container}>
    <FlatList
      data={notes}
      renderItem={renderItem}
      style={{ width: "100%" }}
      keyExtractor={(item) => item.id.toString()}
    />
  </View>
);
}


const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: "#ffc",
   alignItems: "center",
   justifyContent: "center",
 },
});





