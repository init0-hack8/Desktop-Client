import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/configs/firebase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

function History() {
  const [posts, setPosts] = useState([]);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const q = query(
          collection(db, "posts"),
          where("uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const userPosts = querySnapshot.docs.map((doc) => doc.data());
        setPosts(userPosts);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Your Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {posts.map((post, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{post.description}</CardTitle>
                <CardDescription>
                    {post.platform}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {post.isJobUpdate && (
                  <span className="text-sm text-blue-600 font-semibold">
                    Job Update
                  </span>
                )}
                <div className="flex flex-wrap gap-3">
                  {post.imageUrls.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Post ${index} - ${i}`}
                      className="w-28 h-28 object-cover rounded-md border"
                    />
                  ))}
                </div>
                <CardDescription>
                  {new Date(post.createdAt).toLocaleString()}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default History;
