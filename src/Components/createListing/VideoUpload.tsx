import { useMemo, useRef, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { FormData } from "./CreateListing";

interface VideoUploadProps {
  video: File | null;
  setVideo: React.Dispatch<React.SetStateAction<File | null>>;
  setValue: UseFormSetValue<FormData>;
}

const VideoUpload = ({ video, setVideo, setValue }: VideoUploadProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showPlayButton, setShowPlayButton] = useState(true);

  const videoURL = useMemo(
    () => (video ? URL.createObjectURL(video) : null),
    [video],
  );

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideo(file);
      setValue("video", file);
      setShowPlayButton(true);
      setTimeout(() => videoRef.current?.load(), 0);
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setShowPlayButton(false));
    } else {
      videoRef.current.pause();
      setShowPlayButton(true);
    }
  };

  return (
    <div>
      <h3 className="text-[20px] md:text-[24px] font-semibold text-secondary-black">
        Listing Approval Process
      </h3>
      <p className="text-[16px] text-[#67645F] mt-2 w-full md:max-w-[400px]">
        To ensure all products and services on Sustainable Trades meet our
        sustainability standards, each listing must be approved before it goes
        live. Please upload a short video introducing yourself and your product
        or service. In the video, share details about how and where your product
        was made, how your food was grown, and how it aligns with our
        sustainability guidelines. This helps us maintain the quality and
        integrity of our marketplace.
      </p>
      <div className="flex gap-4 mt-3 w-full">
        <label className="px-4 md:px-8 py-2.5 md:py-5 bg-[#F0EEE9] rounded-lg cursor-pointer text-[14px] md:text-[16px] text-secondary-black">
          Upload video
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoUpload}
          />
        </label>
        {video && (
          <button
            className="px-4 py-2 border rounded-lg"
            onClick={() => {
              setVideo(null);
              setValue("video", null);
            }}
          >
            Remove video
          </button>
        )}
      </div>

      {video && videoURL && (
        <div className="mt-4 w-[300px] relative">
          <video
            ref={videoRef}
            src={videoURL}
            className="h-[250px] w-full rounded-lg object-cover"
            onClick={handlePlayPause}
          />
          {showPlayButton && (
            <button
              className="h-24 w-24 bg-[#626161] text-white rounded-full absolute cursor-pointer top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex justify-center items-center"
              onClick={e => {
                e.stopPropagation();
                videoRef.current?.play().then(() => setShowPlayButton(false));
              }}
            >
              <span className="inline-block w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></span>
            </button>
          )}
          {!showPlayButton && (
            <button
              className="absolute top-2 right-2 px-3 py-1 bg-black text-white rounded"
              onClick={() => {
                videoRef.current?.pause();
                setShowPlayButton(true);
              }}
            >
              Pause
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
