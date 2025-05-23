import React, {useState, useEffect} from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "@/configs/firebase";
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString()
      };
      await setDoc(userRef, userData, { merge: true });
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };  
  return (
    <>
        <Card className="mx-auto max-w-sm mt-[22vh]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Enter your email and password to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <div className='text-center'>
            or
          </div>
          <Button onClick={handleGoogleLogin} type="submit" className="w-full">
            <GoogleIcon />
            Login with google
          </Button>
        </div>
      </CardContent>
    </Card>
    </>
  )
}

function GoogleIcon(props) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    const listener = (e) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', listener);
    return () => darkModeQuery.removeEventListener('change', listener);
  }, []);
  const iconSrc = isDarkMode ? './googleDarkMode.svg' : './googleLightMode.svg';
  return (
    <img src={iconSrc} className="w-[2.5vh]" alt="Mountain" />
  );
}

export default Landing