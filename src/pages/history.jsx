import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/configs/firebase";
import { doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function History() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [uid, setUid] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const q = query(collection(db, "post"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userPosts = querySnapshot.docs.map((doc) => doc.data());
        setPosts(userPosts);
      }
    });
    return () => unsubscribe();
  }, []);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const docId = 'post-b2658470-1759-4884-a118-607b242bf9aa'
  async function copyShit() {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      // 1) Read from "analysis/post-b2658470..."
      const fromRef = doc(db, 'analysis', docId)
      const fromSnap = await getDoc(fromRef)
      if (!fromSnap.exists()) {
        throw new Error(`Doc not found in "analysis" with ID: ${docId}`)
      }
      const dataToCopy = fromSnap.data()

      // 2) Write to "result/post-b2658470..."
      const toRef = doc(db, 'result', docId)
      await setDoc(toRef, dataToCopy)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <Navbar />
      {/* <Button onClick={copyShit}>MAGIC COPY BUTTON GO FUCK YOURSELF</Button> */}
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Your Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {posts.map((post, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <Card className="duration-150 hover:scale-[105%] cursor-pointer">
                  <CardHeader>
                    <CardTitle>{post.description}</CardTitle>
                    <CardDescription>{post.platform}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {post.isJobUpdate && (
                      <span className="text-sm text-blue-600 font-semibold">
                        Job Update
                      </span>
                    )}
                    <div className="flex flex-wrap gap-3">
                      {post.imageUrls?.map((url, i) => (
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
              </DialogTrigger>
            
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {post.description}
                  </DialogTitle>
                  <DialogDescription className="text-md">
                    {post.platform} &nbsp;•&nbsp;
                    {new Date(post.createdAt).toLocaleString()}
                  </DialogDescription>
                </DialogHeader>
            
                {post.isJobUpdate && (
                  <p className="text-blue-600 font-semibold mt-2">🚀 Job Update</p>
                )}
            
                <div className="flex flex-wrap gap-4 my-4">
                  {post.imageUrls?.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Zoomed ${index} - ${i}`}
                      className="w-40 h-40 object-cover rounded-lg border"
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  <div className="border rounded-sm p-4 space-y-4">
                    <Label className="text-[3vh] font-semibold">
                      Top Comments:
                    </Label>
                    <div className="flex flex-col">
                      {/* Replace these placeholders with real comments if you have them */}
                      <Label className="duration-150 hover:bg-neutral-800 p-2 rounded-sm">
                        This is a comment.
                      </Label>
                      <Label className="duration-150 hover:bg-neutral-800 p-2 rounded-sm">
                        This is another comment.
                      </Label>
                      <Label className="duration-150 hover:bg-neutral-800 p-2 rounded-sm">
                        This is another another comment.
                      </Label>
                    </div>
                  </div>
                  {/* We navigate to /analysis/:postId */}
                  <Button
                    className="w-[25%] mx-auto"
                    onClick={() => navigate(`/analysis/${post.postId}`)}
                  >
                    More Detail
                  </Button>
                </div>
                <CardDescription>{post.postId}</CardDescription>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  );
}

export default History;
