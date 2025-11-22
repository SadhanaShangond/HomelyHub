import { Trash2 } from "lucide-react";
import React, { useState } from "react";

const ImagesUploading = ({ field }) => {

  // const [image, setImage] = useState("");
  // const [imagesList, setImagesList] = useState([]);
  const [imageInput, setImageInput] = useState("");


  const handleImageInputChange = (event) => {
    setImageInput(event.target.value);
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];

  //   if (file) {
  //     // Read the file as data URL
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setImage(e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //     handleAddImage();
  //   }
  // };

  // When we are uploading local file
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          public_id: `file_${Date.now()}`,
          url: e.target.result,
        };
        field.handleChange([...field.state.value, newImage]);
      };
      reader.readAsDataURL(file);
    }
  }

  // const handleAddImage = () => {
  //   if (image) {
  //     setImagesList([...imagesList, image]);
  //     setImage("");
  //   }
  // };

  const handleAddImage = () => {
    if (imageInput) {
      const newImage = {
        public_id: `file_${Date.now()}`,
        url: imageInput,
      };
      field.handleChange([...field.state.value, newImage]);
      setImageInput("");
    }
  }

  // const handleDeleteImage = (index) => {
  //   const updatedImagesList = [...imagesList];
  //   updatedImagesList.splice(index, 1);
  //   setImagesList(updatedImagesList);
  // };

  const handleDeleteImage = (index) => {
    const updatedImages = [...field.state.value];
    updatedImages.splice(index, 1);
    field.handleChange(updatedImages);
  }

  return (
    <div className="photos-container">
      <h4 className="photos-header">Photos</h4>
      <label className="form-labels">More=Better</label>
      <div className="image-link-container">
        <input
          className="image-link"
          type="text"
          placeholder="Add using link /.jpg"
          onChange={handleImageInputChange}
          value={imageInput}
        />
        <button className="add-button" type="button" onClick={handleAddImage}>
          Add
        </button>
      </div>
      <div className="image-list-container">
        {field.state.value.map((imageObj, index) => (
          <div className="image-preview-box" key={index}>
            <img
              alt={`Ige-${index}`}
              src={imageObj.url}
              className="preview-image"
              height="200px"
              width="200px"
            />
            <button
              type="button"
              onClick={() => handleDeleteImage(index)}
            >
              <Trash2 />
            </button>
          </div>
        ))}
        <label className="upload">
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
          ></input>
          <span class="material-symbols-outlined">upload</span>
          Upload Photo
        </label>
      </div>
    </div>
  );
};

export default ImagesUploading;
