// app/(tabs)/addBook.tsx
import { addDoc, collection, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../src/configurations/firebase";

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  publishedYear: string;
  genre: string;
  description: string;
  price: string;
}

const Test = () => {
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    isbn: "",
    publishedYear: "",
    genre: "",
    description: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof BookFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      Alert.alert("Validation Error", "Please enter book title");
      return false;
    }
    if (!formData.author.trim()) {
      Alert.alert("Validation Error", "Please enter author name");
      return false;
    }
    if (formData.publishedYear && isNaN(Number(formData.publishedYear))) {
      Alert.alert("Validation Error", "Published year must be a number");
      return false;
    }
    if (formData.price && isNaN(Number(formData.price))) {
      Alert.alert("Validation Error", "Price must be a number");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Add document to Firestore
      const docRef = await addDoc(collection(db, "books"), {
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn.trim() || null,
        publishedYear: formData.publishedYear
          ? parseInt(formData.publishedYear)
          : null,
        genre: formData.genre.trim() || null,
        description: formData.description.trim() || null,
        price: formData.price ? parseFloat(formData.price) : null,
        createdAt: Timestamp.now(),
      });

      console.log("Document written with ID: ", docRef.id);

      Alert.alert(
        "Success! 🎉",
        `Book "${formData.title}" has been added successfully!`,
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setFormData({
                title: "",
                author: "",
                isbn: "",
                publishedYear: "",
                genre: "",
                description: "",
                price: "",
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert(
        "Error",
        "Failed to add book. Please check your Firebase configuration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className={`px-6 py-4`}>
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Add New Book
            </Text>
            <Text className="text-gray-600">
              Fill in the details to add a book to your collection
            </Text>
          </View>

          {/* Form Fields */}
          <View className="">
            {/* Title */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2">
                Title <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholder="Enter book title"
                value={formData.title}
                onChangeText={(value) => handleInputChange("title", value)}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Author */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2 mt-4">
                Author <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholder="Enter author name"
                value={formData.author}
                onChangeText={(value) => handleInputChange("author", value)}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* ISBN */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2 mt-4">
                ISBN
              </Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholder="Enter ISBN number"
                value={formData.isbn}
                onChangeText={(value) => handleInputChange("isbn", value)}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Published Year & Price Row */}
            <View className="flex-row gap-4 mt-4">
              <View className="flex-1">
                <Text className="text-gray-700 font-semibold mb-2">
                  Published Year
                </Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                  placeholder="2024"
                  value={formData.publishedYear}
                  onChangeText={(value) =>
                    handleInputChange("publishedYear", value)
                  }
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View className="flex-1">
                <Text className="text-gray-700 font-semibold mb-2">
                  Price ($)
                </Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                  placeholder="29.99"
                  value={formData.price}
                  onChangeText={(value) => handleInputChange("price", value)}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Genre */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2 mt-4">
                Genre
              </Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholder="Fiction, Mystery, Romance..."
                value={formData.genre}
                onChangeText={(value) => handleInputChange("genre", value)}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Description */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2 mt-4">
                Description
              </Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 h-32"
                placeholder="Enter book description..."
                value={formData.description}
                onChangeText={(value) =>
                  handleInputChange("description", value)
                }
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`rounded-lg py-4 mt-6 ${
                loading ? "bg-primary/50" : "bg-primary"
              }`}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">
                  Add Book
                </Text>
              )}
            </TouchableOpacity>

            {/* Reset Button */}
            <TouchableOpacity
              className="border border-gray-300 rounded-lg py-4 mt-4"
              onPress={() =>
                setFormData({
                  title: "",
                  author: "",
                  isbn: "",
                  publishedYear: "",
                  genre: "",
                  description: "",
                  price: "",
                })
              }
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text className="text-gray-700 text-center font-semibold text-lg">
                Clear Form
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Test;
