export const removeBackground = async (name: string, file: File) => {
  const remover = (await import("@imgly/background-removal")).default;

  console.log("Processing file: ", name, file.size);
  console.time("process" + name);

  const blob = await remover(file, {
    publicPath:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/cleansnip/models/"
        : "https://sheharyar566.gitub.io/cleansnip/models/",
    proxyToWorker: true,
  });

  console.timeEnd("process" + name);

  return blob;
};
