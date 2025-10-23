// src/components/LandingPage.tsx
import React, { useState } from "react";

const LandingPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [duration, setDuration] = useState(5);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:3001/api";

  const handleGenerate = async () => {
    if (!title || !name || !backgroundImage) {
      alert("Please fill in all required fields (Title, Name, Background Image)");
      return;
    }

    setLoading(true);
    setVideoUrl(null);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/generate-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          name,
          message,
          backgroundImage,
          textColor,
          duration,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVideoUrl(data.videoUrl);
      } else {
        setError(data.error || "Failed to generate video");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🎥 Dynamic Video Generator</h1>
          <p className="text-gray-600">Create custom videos powered by Remotion</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Video Configuration</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video Title *</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Background Image Selection with Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Image *</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={backgroundImage}
                onChange={(e) => setBackgroundImage(e.target.value)}
              >
                <option value="">Select a background</option>
                <option value="/bg-images/sunset.png">Sunset</option>
              </select>
              {backgroundImage && (
                <img
                  src={backgroundImage}
                  className="mt-4 w-full h-40 object-cover rounded-lg border border-gray-200"
                  alt="Background preview"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
              <input
                type="color"
                className="w-full h-10 rounded-lg cursor-pointer"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration: <span>{duration}</span>s
              </label>
              <input
                type="range"
                min={3}
                max={30}
                value={duration}
                className="w-full"
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              {loading ? "Generating..." : "Generate Video"}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Output</h2>
            {loading && (
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-blue-800 font-medium">Generating your video...</p>
                <p className="text-blue-600 text-sm mt-2">This may take 30-60 seconds</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                <p className="text-red-800 font-medium mb-2">Error:</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {videoUrl && (
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <p className="text-green-800 font-medium text-center mb-4">Video generated successfully!</p>
                <video controls className="w-full rounded-lg mb-4">
                  <source src={videoUrl} type="video/mp4" />
                </video>
                <a
                  href={videoUrl}
                  download
                  className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                >
                  Download Video
                </a>
              </div>
            )}

            {!loading && !videoUrl && !error && (
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center">
                <p className="text-gray-600">Fill the form and click Generate to create your video</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
