import { FormData } from "./CreateListing";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

interface ImageUploadProps {
  imageFiles: File[];
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  previewImages: string[];
  setPreviewImages: React.Dispatch<React.SetStateAction<string[]>>;
  setValue: UseFormSetValue<FormData>;
  watch: UseFormWatch<FormData>;
}

const ImageUpload = ({
  imageFiles,
  setImageFiles,
  previewImages,
  setPreviewImages,
  setValue,
  watch,
}: ImageUploadProps) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 4);
      const combinedFiles = [...imageFiles, ...selectedFiles].slice(0, 4);
      setImageFiles(combinedFiles);
      setValue("images", combinedFiles, { shouldValidate: true });
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      const combinedPreviews = [...previewImages, ...newPreviews].slice(0, 4);
      setPreviewImages(combinedPreviews);
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentFiles = watch("images") || [];
    const newFiles = currentFiles.filter((_: any, i: number) => i !== index);
    setImageFiles(newFiles);
    setValue("images", newFiles);

    const newPreview = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newPreview);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3 mt-2">
        {previewImages.length > 0 ? (
          previewImages.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={img}
                alt={`Image ${idx + 1}`}
                className="w-full h-[200px] md:h-[250px] object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded cursor-pointer"
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <div className="w-full h-[200px] md:h-[250px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
            <div className="text-center">
              <p className="text-base md:text-lg">No images uploaded</p>
              <p className="text-[12px] md:text-sm">
                Upload up to 4 images to see preview
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3">
        <label className="flex items-center justify-center gap-2 w-full py-2 md:py-4 bg-white rounded-lg cursor-pointer border-2 border-dashed border-black hover:bg-gray-100 transition-colors">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="text-gray-600 font-medium">Upload Images</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={handleImageUpload}
          />
        </label>
      </div>
    </>
  );
};

export default ImageUpload;
