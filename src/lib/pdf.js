import PdfPrinter from "pdfmake"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"
import striptags from "striptags";
import axios from "axios";


export const generatePDFStream = async (id) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  }

  const printer = new PdfPrinter(fonts)

  const blogPostJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../blogposts/blogposts.json")
  const blogPosts = JSON.parse(fs.readFileSync(blogPostJSONPath).toString())
  const blogPost = blogPosts.find(p => p._id.toString() === id.toString())

  let imagePart = {};
  if (blogPost.cover) {
    const response = await axios.get(blogPost.cover, {
      responseType: "arraybuffer",
    });
    const blogPostCoverURLParts = blogPost.cover.split("/");
    const fileName = blogPostCoverURLParts[blogPostCoverURLParts.length - 1];
    const extension = fileName.split(".")[1];
    const base64 = response.data.toString("base64");
    const base64Image = `data:image/${extension};base64,${base64}`;
    imagePart = { image: base64Image, width: 500, margin: [0, 0, 0, 40] };
  }

  const docDefinition = {
    content: [
      imagePart,
      { text: blogPost.title, fontSize: 20, bold: true, margin: [0, 0, 0, 40] },
      { text: striptags(blogPost.content), lineHeight: 2 },
    ],
  };

  const options = {
    // ...
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, options)
  return pdfReadableStream
}
