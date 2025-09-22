import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { api } from "../../../convex/_generated/api";

export default function TasksScreen() {
  const { userId, isSignedIn } = useAuth();
  const [taskText, setTaskText] = useState("");
  const tasks = useQuery(api.tasks.get, isSignedIn ? {} : "skip");
  const addTask = useMutation(api.tasks.add);

  const handleAddTask = async () => {
    if (!taskText.trim()) return;
    await addTask({ text: taskText });
    setTaskText("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          value={taskText}
          onChangeText={setTaskText}
        />
        <Button title="Add" onPress={handleAddTask} />
      </View>
      <FlatList
        data={tasks || []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#888", marginTop: 24 }}>No tasks yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
    padding: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 12,
    marginRight: 8,
    fontSize: 16,
  },
  taskItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
});
