import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";

// Custom dark mode hook
function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(matchMedia.matches);

    const handler = (e) => setIsDark(e.matches);
    matchMedia.addEventListener("change", handler);

    return () => matchMedia.removeEventListener("change", handler);
  }, []);

  return isDark;
}

function Dashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isJobUpdate, setIsJobUpdate] = useState(false);
  const [postContent, setPostContent] = useState(""); 
  const isDarkMode = useDarkMode();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = [];

    files.forEach((file) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    if (files.length === 0) setImagePreviews([]);
  };

  const getIcon = (platform) => `./${platform}${isDarkMode ? 'DarkMode' : 'LightMode'}.svg`;

  return (
    <>
      <Navbar />
      <div className='flex flex-col items-center mt-[5vh] gap-5'>
        <div className="flex flex-row gap-10">
          {/* Left Card */}
          <Card className="w-[40vw]">
            <CardContent className="p-6 space-y-4">
              {/* Post Content */}
              <div className="grid w-full items-center gap-1.5 h-40">
                <Label htmlFor="post">Enter Post Content</Label>
                <div className="grid w-full items-start gap-1.5 relative">
                  <Textarea
                    id="post"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="..."
                    className="w-full h-[15vh] resize-none pr-12"
                    maxLength={
                      selectedPlatform === "twitter" || selectedPlatform === "threads"
                        ? 140
                        : undefined
                    }
                  />
                  {(selectedPlatform === "twitter" || selectedPlatform === "threads") && (
                    <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                      {postContent.length}/140
                    </span>
                  )}
                </div>
                {(selectedPlatform === "twitter" || selectedPlatform === "threads") && (
                  <span className="text-xs text-gray-500">Max 140 characters</span>
                )}
              </div>

              {/* LinkedIn Job Update */}
              {selectedPlatform === "linkedin" && (
                <div className="flex items-center gap-2">
                  <Checkbox id="jobUpdate" />
                  <Label
                    htmlFor="is it a job update?"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Is this a Job Update
                  </Label>
                </div>
              )}

              {/* Image Preview */}
              <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
                {imagePreviews.length > 0 ? (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {imagePreviews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Preview ${i}`}
                        className="max-h-40 rounded-lg border"
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <FileIcon className="w-12 h-12" />
                    <span className="text-sm font-medium text-gray-500">
                      Drag and drop a file or click to browse
                    </span>
                    <span className="text-xs text-gray-500">PDF, image, video, or audio</span>
                  </>
                )}
              </div>

              {/* File Input */}
              <div className="space-y-2 text-sm">
                <Label htmlFor="file" className="text-sm font-medium">
                  File
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  multiple={selectedPlatform === "instagram"}
                  onChange={handleImageChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg">Upload</Button>
            </CardFooter>
          </Card>

          {/* Right Card: Platform Selection */}
          <Card>
            <ToggleGroup
              type="single"
              value={selectedPlatform}
              onValueChange={(val) => setSelectedPlatform(val)}
              className="grid grid-cols-3 gap-4 w-full max-w-4xl mx-auto p-4"
            >
              {["twitter", "instagram", "facebook", "threads", "linkedin"].map((platform) => (
                <ToggleGroupItem
                  key={platform}
                  value={platform}
                  variant="outline"
                  className="flex flex-col items-center justify-center p-6 w-full h-36"
                >
                  <img src={getIcon(platform)} className="w-20 mb-2" alt={platform} />
                  <Label className="text-lg">{platform.charAt(0).toUpperCase() + platform.slice(1)}</Label>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Card>
        </div>
        <Button size="lg" className="w-40">Submit</Button>
      </div>
    </>
  );
}

// File icon component
function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

export default Dashboard;