import { DownloadIcon, LoaderIcon, RemoveIcon, StarIcon } from "@/icons";
import { getImageThumbnail } from "@/utils/getImageThumbnail";
import Image from "next/image";
import { useMemo } from "react";
import toast from "react-hot-toast";

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
  const image = useMemo(() => getImageThumbnail(originalFile), [originalFile]);

  const onDownloadFile = async () => {
    if (!postProcessFile) {
      return;
    }

    const fileSaver = (await import("file-saver")).default;
    fileSaver.saveAs(postProcessFile, originalFile.name);
  };

  return (
    <div className="h-52 w-full relative rounded-md border border-secondary border-opacity-20 border-dashed shadow-sm overflow-hidden">
      {/* Image */}
      <Image
        src={image}
        alt="Background image"
        width={200}
        height={200}
        className="absolute top-0 right-0 bottom-0 left-0 object-cover w-full h-full"
      />

      {/* Processing overlay */}
      {isProcessing && (
        <div className="top-0 right-0 bottom-0 left-0 grid place-items-center absolute bg-slate-950 bg-opacity-60 z-10">
          <span className="animate-spin">
            <LoaderIcon />
          </span>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col gap-2 items-stretch absolute bottom-0 left-0 right-0 p-2 bg-white z-0">
        <span className="line-clamp-1 text-xs text-secondary font-thin">
          {originalFile.name}
        </span>

        <div className="flex flex-row gap-2 justify-end">
          <button onClick={onProcessFile} className="fileButton">
            <StarIcon className="fileButtonIcon text-primary" />
          </button>

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
    </div>
  );
};

export default File;
