import { uploadFileDataImage } from "./httpBaseUtils.js";
import "../../configs/config.js";

function uploadAdapter(loader) {
  return {
    upload: function () {
      return new Promise((resolve, reject) => {
        const data = new FormData();
        loader.file.then((file) => {
          data.append("file", file);
          uploadFileDataImage(data)
            .then((response) => {
              var image_head = response.data.url;
              resolve({
                default: image_head,
              });
            })
            .catch((error) => {
              console.log("error", error);
              reject(false);
            });
        });
      });
    },
  };
}

export function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return uploadAdapter(loader);
  };
}
