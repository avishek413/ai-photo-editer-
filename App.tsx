import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { editImage } from './services/geminiService';
import { IconButton } from './components/IconButton';
import { DownloadIcon, RefreshIcon } from './components/Icons';

type ImageData = {
  base64: string;
  mimeType: string;
};

const App: React.FC = () => {
  const [initialImage, setInitialImage] = useState<ImageData | null>(null);
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (base64: string, mimeType: string) => {
    const imageData = { base64, mimeType };
    setInitialImage(imageData);
    setCurrentImage(imageData);
    setEditedImage(null);
    setError(null);
    setPrompt('');
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt || !currentImage) {
      setError('Please enter a prompt and upload an image.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await editImage(currentImage.base64, currentImage.mimeType, prompt);
      if (result) {
        setEditedImage(result);
        const newMimeType = result.split(';')[0].split(':')[1] || 'image/png';
        setCurrentImage({ base64: result, mimeType: newMimeType });
      } else {
        setError('The AI could not generate an image. Please try a different prompt.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(errorMessage);
      setError(`Failed to edit image: ${errorMessage}. Please check your API key and try again.`);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, currentImage]);

  const handleStartOver = () => {
    setInitialImage(null);
    setCurrentImage(null);
    setEditedImage(null);
    setPrompt('');
    setError(null);
    setIsLoading(false);
  };
  
  const handleDownload = () => {
    if(!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = `edited-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="min-h-screen bg-base-100 text-text-primary font-sans">
      {isLoading && <Loader />}
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {!initialImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="flex flex-col gap-8">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg animate-fade-in">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ImageDisplay title="Original" src={initialImage.base64} />
              <ImageDisplay 
                title="Edited" 
                src={editedImage ?? initialImage.base64} 
                isPlaceholder={!editedImage} 
              />
            </div>
            <div className="flex flex-col gap-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your edits, e.g., 'add a majestic castle in the background'"
                className="w-full p-4 bg-base-200 border border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200 resize-none text-text-primary placeholder-text-secondary"
                rows={3}
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt}
                  className="w-full sm:w-auto flex-grow text-white font-bold py-3 px-6 rounded-lg bg-brand-primary hover:bg-brand-secondary disabled:bg-base-300 disabled:cursor-not-allowed transition duration-300 shadow-lg"
                >
                  {isLoading ? 'Generating...' : 'Generate'}
                </button>
                <IconButton onClick={handleDownload} disabled={!editedImage} aria-label="Download Image">
                  <DownloadIcon />
                </IconButton>
                <IconButton onClick={handleStartOver} aria-label="Start Over">
                  <RefreshIcon />
                </IconButton>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;