import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Optional: If you're accepting JSON in requests

// Add this route 👇
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Your other API routes would go here

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

