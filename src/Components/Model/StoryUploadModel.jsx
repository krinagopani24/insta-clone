import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import imageCompression from "browser-image-compression";
import { Button } from "@material-tailwind/react";
import { AuthContext } from "../../hooks/AuthContext";
import { SnackBarContext } from "../../App";
import { uploadStory } from "../../lib/firebase";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: 4,
  boxShadow: 24,
};

export default function StoryUploadModel({ open, setOpen }) {
  const { setSnackBar } = useContext(SnackBarContext);
  const { currentUser } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [picture, setPicture] = useState(null);
  const [type, setType] = useState('')

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
        setType('image')
        const compressedImage = await imageCompress(selectedFile);
        setPicture(compressedImage);
      } else {
        setType('video')
        setPicture(selectedFile);
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
  const post = useMemo(() => picture, [picture]);
  const handleClose = () => {
    setOpen(false);
    setPicture(null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (picture) {
      const data = {
        type:type,
        uid: currentUser.uid,
        file: picture,
      };
      const message = await uploadStory(data);
      setSnackBar({
        ...message,
      });
      handleClose();
    } else {
      setSnackBar({
        open: true,
        message: "Please select a file...",
        style: "error",
      });
    }
    setIsLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ p: 1 }} className="flex justify-between">
          <Button
            variant="filled"
            color="blue"
            onClick={() => fileInputRef.current.click()}
          >
            Select File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png, .jpg, .jpeg, .jfif, .pjpeg, .pjp, .heif, .heic,.mp4, .mov, .webm, .ogg, .flv"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button
            variant="filled"
            color="blue"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Post Story"}
          </Button>
        </Box>
        <PreView formData={post} />
      </Box>
    </Modal>
  );
}

const PreView = memo(function Video({ formData }) {
  return (
    formData &&
    (formData.type.includes("image") ? (
      <img
        className="h-1/2 w-full rounded-md object-fill object-center"
        src={URL.createObjectURL(formData)}
        alt="Selected file"
      />
    ) : formData.type.includes("video") ? (
      <video
        className="h-1/2 max-h-[85vh] w-[auto] rounded-md object-fill object-center"
        controls
        src={URL.createObjectURL(formData)}
      >
        Your browser does not support the video tag.
      </video>
    ) : null)
  );
});
