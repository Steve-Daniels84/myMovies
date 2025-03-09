const {
    S3Client,
    ListObjectsV2Command,
    PutObjectCommand,
    GetObjectCommand,
  } = require("@aws-sdk/client-s3");
  
  const fs = require("fs");
  const path = require("path");

  const UPLOAD_TEMP_PATH = path.join(__dirname, "../temp");

  const s3Client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION || "us-east-1",
    endpoint: "http://localhost:4566", //remove this line before deployment
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });
  
  const listObjectsParams = {
    Bucket: "test-bucket-lambda-steve", //ensure this matches the bucket you are going to use before deployment
  };

  if (!fs.existsSync(UPLOAD_TEMP_PATH)) {
    fs.mkdirSync(UPLOAD_TEMP_PATH, { recursive: true });
    console.log(`Created temp directory at: ${UPLOAD_TEMP_PATH}`);
  }
  
  //List all objects in the bucket
  async function getObjects(req, res) {
    try {
      const command = new ListObjectsV2Command(listObjectsParams);
      const data = await s3Client.send(command);
      res.status(200).json(data); // send the data to the client
    } catch (error) {
      console.error(error);
      res.status(500).send("Error listing objects");
    }
  }
  
  //add object to the bucket
  async function addObject(req, res) {
    try {
      console.log("Request body type:", typeof req.body);
      console.log("Request files:", req.files ? Object.keys(req.files) : "No files");
      
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
  
      // Get the file object - be more flexible with the field name
      let uploadFile;
      if (req.files.image) {
        uploadFile = req.files.image;
      } else {
        // If 'image' field not found, try the first file in the request
        const fileKey = Object.keys(req.files)[0];
        uploadFile = req.files[fileKey];
      }
      
      if (!uploadFile) {
        return res.status(400).send("Could not find file in request");
      }
      
      console.log(`Processing file: ${uploadFile.name}, size: ${uploadFile.size}`);
  
      const uniqueFileName = `${uploadFile.name}`;
      
      // Upload directly to S3 using the file's buffer data
      const command = new PutObjectCommand({
        Bucket: "test-bucket-lambda-steve",
        Key: `original-images/${uniqueFileName}`,
        Body: uploadFile.data, // Use file.data (Buffer) instead of streams
        ContentType: uploadFile.mimetype
      });
  
      await s3Client.send(command);
      
      return res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        filename: uniqueFileName,
        path: `original-images/${uniqueFileName}`
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).send(`Error adding object: ${error.message}`);
    }
  }

  //get an object from the bucket
  async function getObject(req, res) {
    const getObjectParams = {
      Bucket: "test-bucket-lambda-steve", //ensure this matches the bucket you are going to use before deployment
      Key: 'original-images/' + req.params.key,
    };
  
    try {
      const command = new GetObjectCommand(getObjectParams);
      const { Body } = await s3Client.send(command); // `Body` is a stream
  
      // Set headers for file download
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${req.params.key}"`
      );
      res.setHeader("Content-Type", "image/png"); // or "image/jpeg" based on your file type  
      // Pipe the S3 object stream to the response
      Body.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error getting object: " + error);
    }
  }
  
  module.exports = {
    getObjects,
    addObject,
    getObject,
  };
  