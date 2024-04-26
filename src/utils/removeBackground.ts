export const removeBackground = async (name: string, file: File) => {
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
  });

  console.timeEnd("process" + name);

  return blob;
};
