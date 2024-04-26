import {
  DownloadIcon,
  LeftRightArrowIcon,
  LoaderIcon,
  Maximize,
  RemoveIcon,
  StarIcon,
} from "@/icons";
import { getImageThumbnail } from "@/utils/getImageThumbnail";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Preview from "./preview";

interface Props {
  originalFile: File;
  postProcessFile?: Blob;
  onDeleteFile: () => void;
  onProcessFile: () => void;
  isProcessing: boolean;
}

const File = ({
  originalFile,
  postProcessFile,
  isProcessing,
  onDeleteFile,
  onProcessFile,
}: Props) => {
  const [isOriginalVisible, setIsOriginalVisible] = useState<boolean>(true);
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);

  useEffect(() => {
    setIsOriginalVisible(false);
  }, [postProcessFile]);

  const image = useMemo(
    () =>
      getImageThumbnail(
        !postProcessFile || isOriginalVisible ? originalFile : postProcessFile
      ),
    [postProcessFile, originalFile, isOriginalVisible]
  );

  const onDownloadFile = async () => {
    if (!postProcessFile) {
      return;
    }

    const fileSaver = (await import("file-saver")).default;
    fileSaver.saveAs(postProcessFile, originalFile.name);
  };

  const toggleIsOriginalFileVisible = () => {
    setIsOriginalVisible((value) => !value);
  };

  const togglePreview = () => {
    setIsPreviewing((value) => !value);
  };

  return (
    <div className="relative h-52 w-full flex flex-col rounded-md group border border-secondary border-opacity-20 border-dashed shadow-sm overflow-hidden">
      {/* Processing overlay */}
      {isProcessing && (
        <div className="top-0 right-0 bottom-0 left-0 grid place-items-center absolute bg-slate-950 bg-opacity-60 z-10">
          <span className="animate-spin">
            <LoaderIcon />
          </span>
        </div>
      )}

      {/* Image */}
      <div className="flex-1 overflow-hidden relative">
        <Image
          src={image}
          alt="Background image"
          width={200}
          height={200}
          className="object-cover object-center w-full h-full"
        />

        {/* Preview button */}
        <div className="hidden absolute top-0 right-0 bottom-0 left-0 group-hover:grid place-items-center bg-secondary bg-opacity-20">
          <button
            onClick={togglePreview}
            className="bg-white rounded-md p-2 opacity-80"
          >
            <Maximize className="fileButtonIcon text-secondary" />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-row justify-between items-center gap-1.5 p-2 bg-white border-t border-t-secondary border-opacity-20 border-dashed">
        <span className="line-clamp-1 text-xs text-secondary font-thin">
          {originalFile.name}
        </span>

        <div className="flex flex-row gap-1.5 justify-end">
          {Boolean(postProcessFile) ? (
            <button
              onClick={toggleIsOriginalFileVisible}
              className="fileButton"
            >
              <LeftRightArrowIcon className="fileButtonIcon text-primary" />
            </button>
          ) : (
            <button onClick={onProcessFile} className="fileButton">
              <StarIcon className="fileButtonIcon text-primary" />
            </button>
          )}

          <button onClick={onDeleteFile} className="fileButton">
            <RemoveIcon className="text-secondary fileButtonIcon" />
          </button>

          {postProcessFile && (
            <button onClick={onDownloadFile} className="fileButton">
              <DownloadIcon className="text-secondary fileButtonIcon" />
            </button>
          )}
        </div>
      </div>

      {isPreviewing &&
        createPortal(
          <Preview image={image} onClose={togglePreview} />,
          document.body
        )}
    </div>
  );
};

export default File;
