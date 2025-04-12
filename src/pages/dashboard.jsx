import React, { useState, useRef } from "react";
import { Upload, AlertCircle, Check } from "lucide-react";

// This is a completely self-contained component with no external dependencies
// besides React and lucide-react for icons
export default function UploadDashboard() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    backstory: ''
  });
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image || !formValues.title || !formValues.description) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Please complete all required fields'
      });
      return;
    }
    
    setLoading(true);
    
    // Create form data for submission
    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', formValues.title);
    formData.append('description', formValues.description);
    formData.append('backstory', formValues.backstory);
    
    try {
      // Simulate API call - replace with actual Gemini API integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAlert({
        show: true,
        type: 'success',
        message: 'Image successfully analyzed! Redirecting to results...'
      });
      
      // In a real implementation, redirect to results or update UI
      console.log('Form data submitted:', {
        image: image.name,
        ...formValues
      });
      
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Error processing your request. Please try again.'
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Self-contained UI components with shadcn-inspired styling
  const Card = ({ children, className }) => (
    <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className || ''}`}>
      {children}
    </div>
  );

  const CardHeader = ({ children, className }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className || ''}`}>
      {children}
    </div>
  );

  const CardTitle = ({ children, className }) => (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className || ''}`}>
      {children}
    </h3>
  );

  const CardDescription = ({ children, className }) => (
    <p className={`text-sm text-gray-500 ${className || ''}`}>
      {children}
    </p>
  );

  const CardContent = ({ children, className }) => (
    <div className={`p-6 pt-0 ${className || ''}`}>
      {children}
    </div>
  );

  const CardFooter = ({ children, className }) => (
    <div className={`flex items-center p-6 pt-0 ${className || ''}`}>
      {children}
    </div>
  );

  const Label = ({ htmlFor, children, className }) => (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none ${className || ''}`}
    >
      {children}
    </label>
  );

  const Input = ({ className, ...props }) => (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className || ''}`}
      {...props}
    />
  );

  const Textarea = ({ className, ...props }) => (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className || ''}`}
      {...props}
    />
  );

  const Button = ({ children, className, ...props }) => (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );

  const Alert = ({ children, type, className }) => (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&:has(svg)]:pl-11 ${
        type === 'error' 
          ? 'bg-red-50 border-red-200 text-red-800' 
          : 'bg-green-50 border-green-200 text-green-800'
      } ${className || ''}`}
    >
      {children}
    </div>
  );

  const AlertTitle = ({ children, className }) => (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className || ''}`}>
      {children}
    </h5>
  );

  const AlertDescription = ({ children, className }) => (
    <div className={`text-sm [&_p]:leading-relaxed ${className || ''}`}>
      {children}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Analysis Dashboard</h1>
        <p className="text-gray-500">Upload your image and get AI-powered analysis and insights</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>
            Fill out the form below to analyze your image with Gemini AI
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image">Image Upload</Label>
              <div
                className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer border-gray-300 hover:border-gray-400"
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {preview ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={preview}
                      alt="Preview" 
                      className="max-h-64 rounded-md mb-2" 
                    />
                    <p className="text-sm text-gray-500">Click to change image</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p>Drag and drop your image here or click to browse</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <p className="text-sm text-gray-500">Give your upload a title</p>
              <Input
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleInputChange}
                placeholder="Title for your image"
                className="mt-1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <p className="text-sm text-gray-500">Describe what's in this image</p>
              <Textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                placeholder="Enter a detailed description of your image"
                className="mt-1"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backstory">Backstory (optional)</Label>
              <p className="text-sm text-gray-500">Share any background context or story behind this image</p>
              <Textarea
                id="backstory"
                name="backstory"
                value={formValues.backstory}
                onChange={handleInputChange}
                placeholder="Add any relevant backstory or context"
                className="mt-1"
                rows={3}
              />
            </div>

            {alert.show && (
              <Alert type={alert.type}>
                {alert.type === 'error' ? 
                  <AlertCircle className="h-4 w-4" /> : 
                  <Check className="h-4 w-4" />
                }
                <AlertTitle>
                  {alert.type === 'error' ? 'Error' : 'Success'}
                </AlertTitle>
                <AlertDescription>
                  {alert.message}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <React.Fragment>
                <span className="mr-2">Analyzing</span>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </React.Fragment>
            ) : (
              'Analyze with AI'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}