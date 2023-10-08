import React, { useRef, useState } from "react";
import {
  actualHeading,
  borderBtn1,
  submitButtonClassUsed,
} from "../../ClassNames";
import axiosInstance from "../../api/axios";
import { FoundFixedButton } from "../Found/Found";
import { setLoginModal } from "../../redux/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";

const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];

const BASE_URL = "https://file-upload-server-70r3.onrender.com/api";

const LostForm = () => {
  // console.log(query.get("order_id"));
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formDetails, setFormDetails] = useState({
    title: "",
    text: "",
    image: "",
    campus: "Jhanjeri",
    place: "",
    tag: "lost",
  });

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();


  const handleFileChange = (event) => {
    // const files = event.target.files;
    const files = event.target.files || event.dataTransfer.files; // Check if files are coming from input or drop event
    console.log("files", files);
    let selectedFilesArray = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      // console.log("file",file);

      reader.onloadend = () => {
        selectedFilesArray.push({
          file,
          preview: reader.result,
        });

        if (selectedFilesArray.length === files.length) {
          setSelectedFiles(selectedFilesArray);
          //   onFileChange(selectedFilesArray);
          // handleUpload(selectedFilesArray);
        }
      };

      reader.readAsDataURL(file);
      // const url = reader.readAsBinaryString(file);
      // console.log(url);
    }
  };

  //   console.log(selectedFiles);
  const handleFileUpload = async () => {

    if (!user) {
      dispatch(setLoginModal(true));
    }


    try {
      const formData = new FormData();
      selectedFiles.forEach((selectedFile) => {
        formData.append("files", selectedFile.file);
      });
      const response = await fetch(`${BASE_URL}/s3/upload`, {
        method: "POST",
        body: formData,
      });
      return response;
    } catch (error) {
      console.log("Error uploading files", error);
    } finally {
      // setSelectedFiles([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formDetails);
    try {
      const imageData = await handleFileUpload();
      const imageUrl = await imageData.json();

      console.log(imageUrl)
      const { data } = await axiosInstance.post("notes/create", {
        ...formDetails,
        image: imageUrl?.fileUrls[0],
      });
    } catch (error) {
      console.log("Error in Filling up Form", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name !== "image") {
      setFormDetails({ ...formDetails, [name]: value });
    }
  };

  return (
    <>
      <div className="md:py-24 md:px-20 py-16 px-6">
        <h2 className={`${actualHeading} text-center w-full`}>
          {" "}
          Report Lost Items{" "}
        </h2>
        <form className="w-full min-h-screen" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Item Name
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Name the Item"
              required=""
              onChange={handleChange}
              value={formDetails?.title}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="text"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              More about Item
            </label>
            <input
              type="text"
              id="text"
              name="text"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required=""
              onChange={handleChange}
              value={formDetails?.text}
            />
          </div>

          <FileUpload
            selectedFiles={selectedFiles}
            handleFileChange={handleFileChange}
          />

          <div className="mb-6">
            <label
              htmlFor="place"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Place
            </label>
            <textarea
              id="message"
              name="place"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Where you find it "
              onChange={handleChange}
              value={formDetails?.place}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="campus"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select your Campus
            </label>
            <select
              id="campus"
              name="campus"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleChange}
              value={formDetails?.campus}
            >
              <option value={"Jhanjeri"}>CGC -J</option>
              <option value={"Landran"}>CGC -L</option>
              <option value={"cu"}>CU</option>
            </select>
          </div>

          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                defaultValue=""
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                required=""
              />
            </div>
            <label
              htmlFor="terms"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              I agree with the{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-blue-500"
              >
                terms and conditions
              </a>
            </label>
          </div>
          <div className="w-full">
            <button type="submit" className={`${submitButtonClassUsed} w-full`}>
              Register Lost Item
            </button>
          </div>
        </form>
      </div>

      <FoundFixedButton />
    </>
  );
};

const FileUpload = ({ selectedFiles, handleFileChange }) => {
  return (
    <div
      className={`bg-white border border-gray-300 dark:border-gray-700 p-5  dark:bg-slate-900 rounded-lg  min-h-590  max-h-[calc(100vh-50px)]  flex gap-3   justify-between  flex-col w-full my-4`}
    >
      <div>
        <h2 className="text-2xl dark:text-white underline text-center mb-2">
          Upload Image
        </h2>

        <FileInput multiple index={1} handleFileChange={handleFileChange} />
      </div>

      <div className="overflow-y-auto">
        {/*  this is to upload and for selected files */}
        {selectedFiles?.length > 0 && (
          <div className="mt-5 grid-cols-1 sm:grid-cols- md:grid-cols-3 grid p-2 gap-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <h2 className="text-2xl col-span-full dark:text-white underline text-center mb-2">
              Selected Media
            </h2>

            {selectedFiles?.map((url, i) => {
              // const fileExtension = url.split(".").pop(); // Extract file extension

              const fileExtension = "";
              let fileElement = null;

              if (url?.file?.type?.includes("image")) {
                fileElement = (
                  <OrderItem key={i} index={i} orderId={i} url={url?.preview} />
                );
              } else {
                fileElement = (
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    Download File
                  </a>
                );
              }

              return (
                <div
                  key={i}
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden relative"
                >
                  {fileElement}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* <button
        onClick={handleFileUpload}
        className={`${submitButtonClassUsed}`}
        type="button"
      >
        {isUploading ? "uploading..." : "Confirm"}
      </button> */}
    </div>
  );
};

const FileInput = ({ multiple, accept, handleFileChange, index }) => {
  const [isDragging, setIsDragging] = useState(false);
  const reftest = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e);
  };

  return (
    <>
      <div className={`flex items-center justify-center w-full mt-5  `}>
        <label
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          htmlFor={index}
          className={`flex flex-col items-center justify-center w-full h-max border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-900 dark:hover:border-gray-500 dark:hover:bg-gray-600 p-2
            ${
              isDragging
                ? "dark:border-blue-500 border-blue-300 "
                : "border-gray-300"
            }
            
            `}
        >
          <div className="flex flex-col items-center justify-center  ">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {accept ? accept : "SVG, PNG, JPG, or GIF"}
              {multiple ? " (Multiple files allowed)" : " (Single file only)"}
            </p>
          </div>
        </label>
        <input
          id={index}
          type="file"
          className="hidden"
          name=""
          multiple={multiple}
          //   accept={accept ? accept : "*"}
          accept="image/*, video/*, application/pdf, text/plain, image/svg+xml , audio/*"
          onChange={handleFileChange}
        />
      </div>
    </>
  );
};

const OrderItem = ({ url }) => {
  return (
    <div className="w-full ">
      <div className="w-full h-56  bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden ">
        <img
          className="rounded-t-lg w-full h-full object-cover  hover:scale-110 transition-all"
          src={url}
          alt="item image"
        />
      </div>
    </div>
  );
};
export default LostForm;
