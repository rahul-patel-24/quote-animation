"use client"; // Enable client-side rendering in Next.js
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dynamic from 'next/dynamic';
import { saveAs } from 'file-saver';
import 'react-quill/dist/quill.snow.css';
import Image from 'next/image';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function QuoteMaker() {
  const [option, setOption] = useState('create');
  // const [quote, setQuote] = useState('');
  const [description, setDescription] = useState('');
  const [background, setBackground] = useState({ type: 'color', value: '' });
  const [border, setBorder] = useState(false);
  const [image, setImage] = useState(null);
  // const [presetTemplate, setPresetTemplate] = useState('');
  const [quoteStyle, setQuoteStyle] = useState('');
  const [tags, setTags] = useState([]);

  // Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const previewElement = document.getElementById('quote-preview');
    if (previewElement) {
      // Convert the preview element to an image and download
      saveAs(previewElement, 'quote-image.png');
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setTags([...tags, e.target.value]);
      e.target.value = '';
    }
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

  return (
    <div className="p-4 max-w-xl mx-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>{option === 'upload' ? 'Upload Quote Image' : 'Create Your Own Quote'}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOption('upload')}>Upload Quote Image</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOption('create')}>Create Your Own Quote</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {option === 'upload' ? (
        <div>
          <label className="block my-4">
            <span className="sr-only">Upload Image</span>
            <input
              type="file"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
          </label>
          {/* Tag Input */}
          <Input
            placeholder="Add tags (press Enter to add)"
            onKeyDown={handleTagAdd}
            className="my-2"
          />
          <div className="flex flex-wrap gap-2 my-2">
            {tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-200 rounded-full">{tag}</span>
            ))}
          </div>
          {image && (
            <div>
              <Image src={image} alt="Uploaded" width={400} height={200} />
              {/* Add cropping and resizing logic here */}
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
          {/* <Input
            placeholder="Enter your quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            maxLength={150}
            className="my-2"
          /> */}

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

          {/* Tag Input */}
          <Input
            placeholder="Add tags (press Enter to add)"
            onKeyDown={handleTagAdd}
            className="my-2"
          />
          <div className="flex flex-wrap gap-2 my-2">
            {tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-200 rounded-full">{tag}</span>
            ))}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Choose Background</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setBackground({ ...background, type: 'color' })}>Background Color</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBackground({ ...background, type: 'gradient' })}>Gradient</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBackground({ ...background, type: 'image' })}>Background Image</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBackground({ ...background, type: 'pattern' })}>Pattern</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {background.type === 'color' && (
            <Input
              type="color"
              onChange={(e) => setBackground({ ...background, value: e.target.value })}
              className="mt-2"
            />
          )}

          <div className="my-2">
            <Input
              type="checkbox"
              checked={border}
              onChange={() => setBorder(!border)}
            />
            Add Border
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Choose Preset Template</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => applyPresetTemplate('template1')}>Preset Template 1</DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyPresetTemplate('template2')}>Preset Template 2</DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyPresetTemplate('template3')}>Preset Template 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Live Preview */}
      {option === 'upload' ? '' : <div id="quote-preview" className="my-4 p-4" style={{ background: background.value, border: border ? '2px solid black' : 'none' }}>
        <h1 className="text-xl font-bold">{quote}</h1>
        <p>{description}</p>
        <div dangerouslySetInnerHTML={{ __html: quoteStyle }} />
      </div>
      }

      <Button onClick={handleDownload} className="my-4">Download</Button>
    </div>
  );
}
