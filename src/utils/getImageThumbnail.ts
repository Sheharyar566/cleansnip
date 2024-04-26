export const getImageThumbnail = (file: File | Blob) => {
  if (!file) {
    throw new Error("Invalid file provided");
  }

  return URL.createObjectURL(file);
};
