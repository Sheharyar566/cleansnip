import {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";

import Dropzone, { useDropzone } from "react-dropzone";
import { PickerIcon } from "../icons";
import { IItem } from "@/types/file.types";

interface Props {
  onFilesPicked: (files: Record<string, IItem>) => void;
}

const FilePicker = ({ onFilesPicked }: Props) => {
  const handlePickedFiles = useCallback(
    (files: File[]) => {
      /**
       * Appending to the files list
       */
      const mappedFiles: Record<string, IItem> = {};

      for (const file of files) {
        mappedFiles[file.name] = {
          original: file,
        };
      }

      onFilesPicked(mappedFiles);
    },
    [onFilesPicked]
  );

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    onDrop: handlePickedFiles,
  });

  return (
    <div
      {...getRootProps()}
      className="w-full h-52 border border-secondary border-opacity-20 shadow-sm rounded-md grid place-items-center border-dashed cursor-pointer hover:opacity-50 transition-opacity"
    >
      <input {...getInputProps()} />
      <PickerIcon className="stroke-secondary opacity-30 h-10 w-10" />
    </div>
  );
};

export default FilePicker;
