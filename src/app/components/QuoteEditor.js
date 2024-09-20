"use client"; // Enable client-side rendering in Next.js

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import dynamic from 'next/dynamic';
import html2canvas from 'html2canvas';
import 'react-quill/dist/quill.snow.css';
import Image from 'next/image';
import { HexColorPicker } from "react-colorful"; // For color picker library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function QuoteMaker() {
  const [option, setOption] = useState('create');
  const [description, setDescription] = useState('');
  const [background, setBackground] = useState({ type: 'color', value: '#ffffff' });
  const [border, setBorder] = useState(true);
  const [image, setImage] = useState(null);
  const [quoteStyle, setQuoteStyle] = useState('');
  const [tags, setTags] = useState([]);
  const [gradient, setGradient] = useState({ color1: '#ff0000', color2: '#0000ff', direction: 'to right' });

  // List of preset patterns
  const presetPatterns = [
    'https://img.freepik.com/free-photo/push-pins-connected-linear-network-background_53876-31254.jpg?w=826&t=st=1726830762~exp=1726831362~hmac=7ff11d0068417c375168fa9e2e4d3d154464068462fe25c1afc4f02fe9718b41',
    'https://img.freepik.com/free-vector/network-connections-background-with-connecting-lines-dots_1048-12244.jpg?w=1380&t=st=1726830810~exp=1726831410~hmac=2dc50ded1675345ee5bc8292a7ddb3c4becfc3ce8a3addc18c91dfe4988d0b2f',
    'https://img.freepik.com/free-vector/colourful-watercolour-texture_1048-11773.jpg?w=900&t=st=1726830826~exp=1726831426~hmac=196c9685e14c508c6028897495e76cffff00f872be5d9a0606b3564506c777d2',
    'https://img.freepik.com/free-vector/grunge-border_1048-7373.jpg?w=360&t=st=1726830846~exp=1726831446~hmac=a592a32bb295f22b8ce08ab0f53dd9a71bd0c88da0f7768d5a6312ac3913d007'
  ];



  // Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBackground({ type: 'image', value: reader.result }); // Set as background image
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const previewElement = document.getElementById('quote-preview');
    if (previewElement) {
      html2canvas(previewElement).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'quote-image.png';
        link.click();
      });
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setTags([...tags, e.target.value]);
      e.target.value = '';
    }
  };

  const handleTagRemove = (index) => {
    setTags(tags.filter((_, idx) => idx !== index));
  };

  const applyPresetTemplate = (template) => {
    switch (template) {
      case 'template1':
        setBackground({ type: 'color', value: '#f3f4f6' });
        setBorder(true);
        setQuoteStyle('<h1 style="color:#1f2937;font-size:24px;">Stylized Quote</h1>');
        break;
      case 'template2':
        setBackground({ type: 'gradient', value: 'linear-gradient(to right, #ff7e5f, #feb47b)' });
        setBorder(false);
        setQuoteStyle('<h1 style="color:#ffffff;font-size:24px;">Gradient Styled Quote</h1>');
        break;
      case 'template3':
        setBackground({ type: 'pattern', value: 'url(/pattern.png)' });
        setBorder(true);
        setQuoteStyle('<h1 style="color:#4a5568;font-size:24px;">Pattern Styled Quote</h1>');
        break;
      default:
        setBackground({ type: 'color', value: '#ffffff' });
    }
  };

  const handleGradientChange = (color1, color2, direction) => {
    setGradient({ color1, color2, direction });
    setBackground({
      type: 'gradient',
      value: `linear-gradient(${direction}, ${color1}, ${color2})`
    });
  };

  const handleBackgroundChange = (value) => {
    switch (value) {
      case 'color':
        setBackground({ type: 'color', value: background.value });
        break;
      case 'gradient':
        setBackground({ type: 'gradient', value: background.value });
        break;
      case 'image':
        setBackground({ type: 'image', value: '' });
        break;
      case 'pattern':
        setBackground({ type: 'pattern', value: background.value });
        break;
      default:
        break;
    }
  };


  return (
    <div className="flex w-full h-screen pl-20 pr-20">
      {/* Left Side: Form */}
      <div className="w-1/2 p-4">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-4 ${option === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setOption('upload')}
          >
            Upload Quote Image
          </button>
          <button
            className={`py-2 px-4 ${option === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setOption('create')}
          >
            Create Your Own Quote
          </button>
        </div>

        {option === 'upload' ? (
          <div>
            {/* Upload Image */}
            <label className="block my-4">
              <span className="sr-only">Upload Image</span>
              <input
                type="file"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
            </label>
            <Input
              placeholder="Add tags (press Enter to add)"
              onKeyDown={handleTagAdd}
              className="my-2"
            />

            <div className="flex flex-wrap gap-2 my-2">
              {tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-200 rounded-full flex items-center">
                  {tag}
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => handleTagRemove(idx)}
                    aria-label={`Remove tag ${tag}`}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              ))}
            </div>
            {image && (
              <div>
                <Image src={image} alt="Uploaded" width={400} height={200} />
              </div>
            )}
            <Textarea
              placeholder="Add a description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              className="my-4"
            />
          </div>
        ) : (
          <div>
            {/* Quote Editor */}
            <ReactQuill
              value={quoteStyle}
              onChange={setQuoteStyle}
              className="my-4"
              placeholder="Customize your quote (bold, font, size, color)"
            />
            <Textarea
              placeholder="Add a description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              className="my-4"
            />

            <Input
              placeholder="Add tags (press Enter to add)"
              onKeyDown={handleTagAdd}
              className="my-2"
            />

            <div className="flex flex-wrap gap-2 my-2">
              {tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-200 rounded-full flex items-center">
                  {tag}
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => handleTagRemove(idx)}
                    aria-label={`Remove tag ${tag}`}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              ))}
            </div>

            <div className="mt-5 mb-5 h-auto flex  my-2">
              <label className='font-bold w-full'>Add Border</label>
              <Input
                type="checkbox"
                className='h-5'
                checked={border}
                onChange={() => setBorder(!border)}
              />
            </div>
            <Separator />

            <div className='mt-5'>
              <Select onValueChange={(value) => handleBackgroundChange(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Choose Background" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="color">Background Color</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="image">Background Image</SelectItem>
                  <SelectItem value="pattern">Pattern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {background.type === 'color' && (
              <Input
                type="color"
                onChange={(e) => setBackground({ ...background, value: e.target.value })}
                className="mt-5"
              />
            )}

            {background.type === 'gradient' && (
              <div className="mt-4">
                <h2 className="text-sm font-semibold">Gradient Picker</h2>
                <div className="flex gap-2 items-center">
                  <HexColorPicker color={gradient.color1} onChange={(color) => handleGradientChange(color, gradient.color2, gradient.direction)} />
                  <HexColorPicker color={gradient.color2} onChange={(color) => handleGradientChange(gradient.color1, color, gradient.direction)} />
                </div>
                <div className="flex items-center mt-2">
                  <label className="mr-2">Direction:</label>
                  <Select value={gradient.direction} onValueChange={(value) => handleGradientChange(gradient.color1, gradient.color2, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to right">Left to Right</SelectItem>
                      <SelectItem value="to bottom">Top to Bottom</SelectItem>
                      <SelectItem value="to top right">Diagonal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {background.type === 'image' && (
              <label className="block my-4">
                <span className="sr-only">Upload Background Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
              </label>
            )}

            {background.type === 'pattern' && (
              <div className="mt-4">
                <h2 className="text-sm font-semibold">Select a Pattern</h2>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  {presetPatterns.map((pattern, idx) => (
                    <div
                      key={idx}
                      className="relative w-full h-24 border rounded-md overflow-hidden cursor-pointer"
                      onClick={() => setBackground({ type: 'pattern', value: `url(${pattern})` })}
                    >
                      <img src={pattern} alt={`Pattern ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black opacity-0 hover:opacity-25 transition-opacity"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className='mt-5'>
              <Select onValueChange={(value) => applyPresetTemplate(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Choose Preset Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template1">Preset Template 1</SelectItem>
                  <SelectItem value="template2">Preset Template 2</SelectItem>
                  <SelectItem value="template3">Preset Template 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Right Side: Preview */}
      <div className="w-1/2 h-1/3  p-4">
        {option === 'upload' ? (''
          // <div className='h-auto w-auto'>
          //   {image && (
          //     <div
          //       id="quote-preview"
          //       className="w-full h-full p-4"
          //       style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover' }}
          //     >
          //       <p>{description}</p>
          //     </div>
          //   )}
          // </div>
        ) : (
          <div
            id="quote-preview"
            className="w-full h-full p-4"
            style={{
              ...(background.type === "image" && { backgroundImage: `url(${background.value})`, backgroundSize: "cover" }),
              ...(background.type === "pattern" && { backgroundImage: background.value }),
              ...(background.type === "color" && { backgroundColor: background.value }),
              ...(background.type === "gradient" && { background: background.value }),
              border: border ? '2px solid black' : 'none'
            }}
          >
            <h1 className="text-xl font-bold" dangerouslySetInnerHTML={{ __html: quoteStyle }} />
            <p>{description}</p>
          </div>
        )}
        {option !== 'upload' && quoteStyle && description && ( // Check if the quote and description are defined
          <Button onClick={handleDownload} className="my-4">Download</Button>
        )}
      </div>
    </div>
  );
}
