import { Box } from "@mui/material";
import {
  useContext,
  useRef,
  useState,
  useCallback,
  memo,
  useMemo,
} from "react";
import { SnackBarContext } from "../../App";
import { AuthContext } from "../../hooks/AuthContext";
import { Button } from "@material-tailwind/react";
import TextArea from "../../Components/TextArea";
import { handlePost } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import { Input } from "@material-tailwind/react";
import imageCompression from "browser-image-compression";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #B8CFEC",
  boxShadow: 24,
  p: 2,
};

const AddPost = () => {
  const navigate = useNavigate();

  const { setSnackBar } = useContext(SnackBarContext);
  const { currentUser } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    picture: null,
    caption: "",
    location: "",
  });

  const fileInputRef = useRef(null);
  const handleFileChange = useCallback(
    async (event) => {
      const selectedFile = event.target.files[0];
      if (!selectedFile) return; // Handle no file selected

      // Validate file type (optional)
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/jfif",
        "image/pjpeg",
        "image/pjp",
        "image/heif",
        "image/heic",
        "video/mp4",
        "video/quicktime",
        "video/webm",
        "video/ogg",
        "video/flv",
      ];
      if (!selectedFile.type || !allowedTypes.includes(selectedFile.type)) {
        setSnackBar({
          open: true,
          message:
            "Only PNG, JPG, JPEG, JFIF, PJPEG, PJP, HEIF, HEIC, MP4, MOV, WEBM, OGG videos are allowed...",
          style: "info",
        });
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setSnackBar({
          open: true,
          message: "File size is too large.,10MB allowed",
          style: "error",
        });
        return;
      }
      if (selectedFile.type.includes("image")) {
        const compressedImage = await imageCompress(selectedFile);
        setFormData((pre) => ({ ...pre, picture: compressedImage }));
      } else {
        setFormData((pre) => ({ ...pre, picture: selectedFile }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const imageCompress = (imageFile) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);

        reader.onload = async (event) => {
          const img = new Image();
          img.src = event.target.result;

          img.onload = async () => {
            const maxHeight = 1024; // Target maximum height
            const maxWidth = Math.round((img.width * maxHeight) / img.height); // Aspect ratio-preserving width

            const options = {
              maxSize: 2 * 1024 * 1024, // Set maximum compressed file size (adjust as needed)
              mimeType: imageFile.type, // Preserve original MIME type
              maxWidth,
              maxHeight,
            };
            try {
              const compressedFile = await imageCompression(imageFile, options);
              resolve(compressedFile);
            } catch (compressionError) {
              reject(compressionError);
            }
          };
          img.onerror = (error) => {
            reject(error);
          };
        };
        reader.onerror = (error) => {
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  };

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      // Insert a newline where the cursor is
      const start = event.target.selectionStart;
      const end = event.target.selectionEnd;
      event.target.value =
        event.target.value.substring(0, start) +
        "\n" +
        event.target.value.substring(end);
      // Put the cursor back in the right place
      event.target.selectionStart = event.target.selectionEnd = start + 1;
    }
  }

  const handleCaptionChange = useCallback(
    (event) => {
      event.preventDefault();
      setFormData((pre) => ({ ...pre, caption: event.target.value }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData.caption]
  );

  const handleLocationChange = useCallback(
    (event) => {
      event.preventDefault();
      setFormData((pre) => ({ ...pre, location: event.target.value }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData.location]
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    const data = {
      uid: currentUser.uid,
      userId: currentUser.userId,
      picture: formData.picture,
      caption: formData.caption,
      location: formData.location,
      type: formData.picture.type.includes("image") ? "post" : "reel",
    };
    const message = await handlePost(data);
    setSnackBar({
      ...message,
    });
    setIsLoading(false);
    navigate("/");
  };

  const person = useMemo(() => formData.picture, [formData.picture]);

  return (
    <Box sx={style} className="space-y-3">
      <Box sx={{ display: "flex", maxHeight: "98%" }}>
        <Button
          className="w-[40%] p-2 mr-1"
          variant="filled"
          color="blue"
          onClick={() => fileInputRef.current.click()}
        >
          Select File
        </Button>
        <Input
          variant="outlined"
          label={"Location"}
          placeholder={"Location"}
          type={"text"}
          value={formData.location}
          onChange={handleLocationChange}
        />
      </Box>
      <input
        ref={fileInputRef}
        type="file"
        accept=".png, .jpg, .jpeg, .jfif, .pjpeg, .pjp, .heif, .heic,.mp4, .mov, .webm, .ogg, .flv"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Box sx={{ maxHeight: "50%" }}>
        <PreView formData={person} />
      </Box>
      <TextArea
        onKeyPress={handleKeyPress}
        placeholder="Caption"
        rows="2"
        value={formData.caption}
        onChange={handleCaptionChange}
      />
      <div className="flex justify-around items-center pt-3">
        <Button color="blue" disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? "Uploading..." : "Post"}
        </Button>
      </div>
    </Box>
  );
};

export default AddPost;

const PreView = memo(function Video({ formData }) {
  return (
    formData &&
    (formData.type.includes("image") ? (
      <img
        className="h-1/2 w-full rounded-md object-fit object-center"
        src={URL.createObjectURL(formData)}
        alt="Selected file"
      />
    ) : formData.type.includes("video") ? (
      <video
        className="max-h-[70vh] w-[auto] rounded-md object-fit object-center"
        controls
        src={URL.createObjectURL(formData)}
      >
        Your browser does not support the video tag.
      </video>
    ) : null)
  );
});
