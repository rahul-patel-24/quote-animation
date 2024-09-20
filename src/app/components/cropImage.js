export default async function getCroppedImg(imageSrc, pixelCrop) {
    const image = new Image();
    image.src = imageSrc;
  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
  
    // Draw the image onto the canvas
    await new Promise((resolve) => {
      image.onload = () => {
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
        resolve();
      };
    });
  
    return canvas.toDataURL('image/jpeg'); // Return cropped image as Data URL
  }