"use client"; // Enable client-side rendering in Next.js
import { useDropzone } from "react-dropzone";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
import { useState } from "react";
import html2canvas from "html2canvas";

const fonts = ["sans-serif", "serif", "monospace", "cursive", "fantasy", "system-ui"];

const QuoteEditor = () => {
  const [quote, setQuote] = useState("Your quote goes here...");
  const [author, setAuthor] = useState("Author Name");
  const [description, setDescription] = useState("Enter description here...");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [borderStyle, setBorderStyle] = useState("solid");
  const [borderColor, setBorderColor] = useState("#000000");
  const [borderWidth, setBorderWidth] = useState(2);
  const [font, setFont] = useState("sans-serif");
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState("#000000");
  const [image, setImage] = useState(null);
  const [filter, setFilter] = useState("none");
  const [avatar, setAvatar] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    },
  });

  const handleDownload = () => {
    const card = document.getElementById("quote-card");
    html2canvas(card).then((canvas) => {
      const link = document.createElement("a");
      link.download = "quote-card.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Panel: Quote Customization */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Customize Your Quote</h2>

          {/* Quote Text */}
          <Textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className="w-full mb-4"
            placeholder="Enter your quote here..."
          />

          {/* Author Name */}
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full mb-4"
            placeholder="Author Name"
          />

          {/* Description */}
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-4"
            placeholder="Enter description here..."
          />

          {/* User Avatar */}
          <div className="flex items-center space-x-4 mb-4">
            <Avatar src={avatar || "/default-avatar.png"} size="md" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = () => setAvatar(reader.result);
                reader.readAsDataURL(file);
              }}
            />
          </div>

          {/* Drag-and-Drop Image */}
          <div
            {...getRootProps()}
            className={`border-dashed border-2 p-4 text-center ${
              isDragActive ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the image here ...</p>
            ) : (
              <p>Drag and drop an image here, or click to select one</p>
            )}
          </div>

          {/* Background Color */}
          <div className="mt-4">
            <label>Background Color:</label>
            <Input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="ml-2"
            />
          </div>

          {/* Border Styles */}
          <div className="mt-4">
            <label>Border Style:</label>
            <select
              value={borderStyle}
              onChange={(e) => setBorderStyle(e.target.value)}
              className="ml-2 p-1 border"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>

            <label className="ml-4">Border Color:</label>
            <Input
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              className="ml-2"
            />
          </div>

          {/* Font and Text Styling */}
          <div className="mt-4">
            <label>Font:</label>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="ml-2 p-1 border"
            >
              {fonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>

            <label className="ml-4">Font Size:</label>
            <Input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="ml-2 w-16 border"
              min="12"
              max="48"
            />
          </div>

          {/* Text Color */}
          <div className="mt-4">
            <label>Text Color:</label>
            <Input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="ml-2"
            />
          </div>

          {/* Filters */}
          <div className="mt-4">
            <label>Apply Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="ml-2 p-1 border"
            >
              <option value="none">None</option>
              <option value="grayscale(100%)">Grayscale</option>
              <option value="sepia(100%)">Sepia</option>
              <option value="blur(2px)">Blur</option>
            </select>
          </div>
        </div>

        {/* Right Panel: Quote Preview */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Quote Preview</h2>
          <div
            id="quote-card"
            style={{
              backgroundColor: bgColor,
              borderStyle: borderStyle,
              borderColor: borderColor,
              borderWidth: `${borderWidth}px`,
              fontFamily: font,
              color: textColor,
              fontSize: `${fontSize}px`,
              backgroundImage: image ? `url(${image})` : "none",
              filter: filter,
            }}
            className="w-full h-64 p-6 flex flex-col justify-center items-center overflow-hidden relative"
          >
            <Avatar src={avatar || "/default-avatar.png"} size="sm" className="absolute top-4 left-4" />
            <p className="text-center break-words">{quote}</p>
            <span className="italic mt-2">- {author}</span>
            <p className="mt-2 text-sm text-gray-500">{description}</p>
          </div>

          {/* Save as Image Button */}
          <Button onClick={handleDownload} className="w-full">
            Save as Image
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuoteEditor;
