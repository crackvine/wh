const readFile = (target, encoding = 'utf8') => (
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (done) => {
      resolve(done.target.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(target, encoding);
  })
);

export default readFile;
