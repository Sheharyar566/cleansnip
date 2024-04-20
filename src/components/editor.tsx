"use client";

import { StarIcon } from "@/icons";
import File from "./file";
import FilePicker from "./picker";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { IItem } from "@/types/file.types";

const Editor = () => {
  const [items, setItems] = useState<Record<string, IItem>>({});

  const [filesInProgress, setFilesInProgress] = useState<Set<string>>(
    new Set()
  );

  const [downloadProgress, setDownloadProgress] = useState<{
    fileName: string;
    progress: number;
    fileIndex: number;
    totalFiles: number;
  }>();

  const hasFilesSelected = Boolean(Object.keys(items).length);

  const onFilesPicked = useCallback((newFiles: Record<string, IItem>) => {
    setItems((prevFiles) => ({ ...prevFiles, ...newFiles }));
  }, []);

  const removeBackground = async (name: string, file: File) => {
    const remover = (await import("@imgly/background-removal")).default;

    console.log("Processing file: ", name, file.size);
    console.time("process" + name);

    const blob = await remover(file, {
      publicPath:
        "http://" +
        window.location.hostname +
        ":" +
        window.location.port +
        "/models/",
      proxyToWorker: true,
      progress: (key, current, total) => {
        if (key.startsWith("fetch")) {
          setDownloadProgress({
            fileName: key,
            progress: (current / total) * 100,
            fileIndex: 0,
            totalFiles: 6,
          });
        }
      },
    });

    console.timeEnd("process" + name);

    return blob;
  };

  const singleRemove = async (fileName: string) => {
    if (filesInProgress.has(fileName)) {
      toast.error("File already in process");
      return;
    }

    setFilesInProgress((value) => {
      const newSet = new Set(...value.values());
      newSet.add(fileName);

      return newSet;
    });

    const blob = await removeBackground(fileName, items[fileName].originalFile);

    setFilesInProgress((value) => {
      const newValue = new Set(...value.values());
      newValue.delete(fileName);

      return newValue;
    });

    const bufferedBlob = await blob.arrayBuffer();
    return { fileName, data: new Uint8Array(bufferedBlob) };
  };

  const bulkRemove = async () => {
    const processedFiles = await Promise.all(
      Object.keys(items).map((name) => singleRemove(name))
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
        console.error(err);
        return;
      }

      fileSaver.saveAs(new Blob([data]), "zipped.zip");
    });
  };

  const onDeleteFile = (fileName: string) => {
    setItems((prevFiles) => {
      const tempFiles = { ...prevFiles };
      delete tempFiles[fileName];

      return tempFiles;
    });
  };

  return (
    <div className="flex flex-col items-stretch">
      <div
        className={`gap-6 p-8 mx-auto ${
          hasFilesSelected
            ? "grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] w-full"
            : "w-4/5 md:w-3/5 xl:w-2/5"
        }`}
      >
        <FilePicker onFilesPicked={onFilesPicked} />

        {Object.entries(items).map(([name, item]) => (
          <File
            key={name}
            originalFile={item.originalFile}
            postProcessFile={item.postProcessFile}
            isProcessing={filesInProgress.has(name)}
            onDeleteFile={() => onDeleteFile(name)}
            onProcessFile={() => singleRemove(name)}
          />
        ))}
      </div>

      {hasFilesSelected && (
        <button
          className="bg-primary px-6 mx-auto py-4 rounded text-white font-bold shadow-indigo-700 flex flex-row gap-2 items-center"
          onClick={bulkRemove}
        >
          Remove Background
          <StarIcon className="text-white h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Editor;
