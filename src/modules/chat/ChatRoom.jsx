import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";


const ChatRoom = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [numImages, setNumImages] = useState(0);
  const [imagePreviews, setImagePreviews] = useState([]);

  const uploadFile = () => {
    if (numImages >= 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }
    if (imageUpload == null) return;
    const folderName = v4(); // generate a unique folder name
    const imageRef = ref(storage, `images/${folderName}/${imageUpload.name}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
        setNumImages((prev) => prev + 1);
      });
    });
  };

  const createImagePreview = (file) => {
    const objectUrl = URL.createObjectURL(file);
    const imagePreview = { src: objectUrl, name: file.name };
    const hasDuplicate = imagePreviews.some(
      (preview) => preview.name === file.name
    );
    if (!hasDuplicate) {
      setImagePreviews((prev) => [...prev, imagePreview]);
    }
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (numImages + files.length > 5) {
      alert("You can select a maximum of 5 images.");
      return;
    }
    setImageUpload(files[0]);
    createImagePreview(files[0]);
  };

  useEffect(() => {
    const imagesListRef = ref(storage, "images/");
    listAll(imagesListRef).then((response) => {
      const promises = response.prefixes.map((prefix) => {
        // get download URLs for images in each subfolder
        const imagesInFolderRef = ref(storage, prefix.fullPath);
        return listAll(imagesInFolderRef).then((imagesResponse) => {
          return Promise.all(
            imagesResponse.items.map((item) => {
              return getDownloadURL(item).then((url) => {
                return { url, name: item.name };
              });
            })
          );
        });
      });
      Promise.all(promises).then((results) => {
        const urls = results.flat().map((result) => result.url);
        const names = results.flat().map((result) => result.name);
        const previews = names.map((name, index) => {
          return { src: urls[index], name };
        });
        setImageUrls(urls);
        setNumImages(urls.length);
        setImagePreviews(previews);
      });
    });
  }, []);


  return (
    <>
    <div className="App">
      <input type="file" onChange={handleFileSelect} />
      <button onClick={uploadFile}>Upload Image</button>
      <div className="image-preview-container">
        {imagePreviews.map((preview, index) => {
          return (
            <div key={index} className="image-preview">
              <img src={preview.src} alt={preview.name} />
              <div>{preview.name}</div>
            </div>
          );
        })}
      </div>
      <div className="image-preview-container">
        {imageUrls.map((url, index) => {
          return (
            <div key={index} className="image-preview">
              <img src={url} alt={`image-${index}`} />
            </div>
          );
        })}
      </div>
    </div>



    </>
  );
};

export default ChatRoom;
