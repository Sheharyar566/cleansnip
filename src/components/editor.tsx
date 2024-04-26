"use client";

import { StarIcon } from "@/icons";
import File from "./file";
import FilePicker from "./picker";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { IItem } from "@/types/file.types";
import { removeBackground } from "@/utils/removeBackground";

const Editor = () => {
  const [files, setFiles] = useState<Record<string, IItem>>({});
  const [filesInProgress, setFilesInProgresss] = useState<string[]>([]);

  const isBulkProcessing = useRef<boolean>(false);

  const hasFilesSelected = Boolean(Object.keys(files).length);

  const onFilesPicked = (newFiles: Record<string, IItem>) => {
    setFiles((prevFiles) => ({ ...prevFiles, ...newFiles }));
  };

  const singleRemove = async (fileName: string) => {
    if (filesInProgress.includes(fileName)) {
      toast.error("File already in process");
      return;
    }

    try {
      setFilesInProgresss((value) => [...value, fileName]);

      const blob = await removeBackground(fileName, files[fileName].original);

      setFiles((value) => ({
        ...value,
        [fileName]: {
          ...value[fileName],
          postProcess: blob,
        },
      }));

      const bufferedBlob = await blob.arrayBuffer();

      if (!isBulkProcessing.current) {
        toast.success("Successfully processed " + fileName);
      }

      return { fileName: fileName, data: new Uint8Array(bufferedBlob) };
    } catch (e) {
      toast.error("Failed to process the file: " + fileName);
      console.error(e);

      throw e;
    } finally {
      setFilesInProgresss((value) => {
        const set = new Set(value);
        set.delete(fileName);

        return Array.from(set);
      });
    }
  };

  const bulkRemove = async () => {
    try {
      isBulkProcessing.current = true;

      const processedFiles = await Promise.all(
        Object.keys(files).map((name) => singleRemove(name))
      );

      const mappedFiles = processedFiles.reduce(
        (prev, current) => ({
          ...prev,
          ...(current
            ? {
                [current.fileName]: [current.data, { level: 0 }],
              }
            : {}),
        }),
        {}
      );

      const zip = (await import("fflate")).zip;
      const fileSaver = (await import("file-saver")).default;

      zip(mappedFiles, {}, async (err, data) => {
        if (err) {
          toast.error("Failed to create the zip");
          console.error(err);

          return;
        }

        fileSaver.saveAs(new Blob([data]), "zipped.zip");
      });
    } catch (e) {
      toast.error("Failed to process the files");
      console.error(e);
    } finally {
      isBulkProcessing.current = false;
    }
  };

  const onDeleteFile = (fileName: string) => {
    setFiles((prevFiles) => {
      const tempFiles = { ...prevFiles };
      delete tempFiles[fileName];

      return tempFiles;
    });
  };

  return (
    <div className="container mx-auto mb-20 flex flex-col items-stretch">
      <div
        className={`gap-6 p-8 mx-auto ${
          hasFilesSelected
            ? "grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] w-full"
            : "w-4/5 md:w-3/5 xl:w-2/5"
        }`}
      >
        <FilePicker onFilesPicked={onFilesPicked} />

        {Object.entries(files).map(([name, file]) => (
          <File
            key={name}
            originalFile={file.original}
            postProcessFile={file.postProcess}
            isProcessing={filesInProgress.includes(name)}
            onDeleteFile={() => onDeleteFile(name)}
            onProcessFile={() => singleRemove(name)}
          />
        ))}
      </div>

      {hasFilesSelected && !filesInProgress.length && (
        <button
          className="text-primary border border-primary bg-white px-6 mx-auto py-4 rounded font-bold flex flex-row gap-2 items-center group hover:text-white hover:bg-primary transition-colors"
          onClick={bulkRemove}
        >
          Remove Background
          <StarIcon className="group-hover:text-white transition-colors text-primary h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Editor;
