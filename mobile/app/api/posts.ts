import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://cautiously-mesocratic-albert.ngrok-free.dev";

// ---------------------------
// Get logged-in user ID
// ---------------------------
export async function getUserId() {
  const id = await AsyncStorage.getItem("user_id");
  return Number(id);
}

// ---------------------------
// Upload Post (image + caption)
// ---------------------------
export async function uploadPost(imageUri: string, caption: string) {
  const user_id = await getUserId();

  const formData = new FormData();
  formData.append("user_id", user_id.toString());
  formData.append("caption", caption);

  const img: any = {
    uri: imageUri,
    type: "image/jpeg",
    name: "upload.jpg",
  };
  formData.append("file", img);

  return axios.post(`${BASE_URL}/posts/add`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// ---------------------------
// Get Feed
// ---------------------------
export async function getFeed() {
  return axios.get(`${BASE_URL}/posts/feed`);
}

// ---------------------------
// Like Post
// ---------------------------
export async function likePost(postId: number) {
  const user_id = await getUserId();
  return axios.post(`${BASE_URL}/posts/${postId}/like?user_id=${user_id}`);
}

// ---------------------------
// Get Comments
// ---------------------------
export async function getComments(postId: number) {
  return axios.get(`${BASE_URL}/posts/${postId}/comments`);
}

// ---------------------------
// Add Comment
// ---------------------------
export async function addComment(postId: number, text: string) {
  const user_id = await getUserId();
  return axios.post(
    `${BASE_URL}/posts/${postId}/comment?user_id=${user_id}&comment=${text}`
  );
}
