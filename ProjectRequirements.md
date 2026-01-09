frontend
npm i axios moment framer-motion react-markdown react-syntax-highlighter remark-gfm react-hot-toast react-icons react-router-dom

backend
npm i express bcryptjs cors dotenv jsonwebtoken mongoose multer @google/genai
npm i nodemon --save-dev

jwt_secret
node -e  "console.log(require('crypto').randomBytes(64).toString('hex'))"