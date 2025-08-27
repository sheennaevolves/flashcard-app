import fs from "fs";
import archiver from "archiver";

const output = fs.createWriteStream("flashcard-app.zip");
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  console.log(`Zip created: ${archive.pointer()} total bytes`);
});

archive.pipe(output);

// Add your folder structure files here
archive.directory("flashcard-app/", false); // your folder with all files

archive.finalize();
