import express from "npm:express";

const port = 8000;
const app = express();
import { Request, Response } from "npm:express";

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});
app.listen(port);
console.log(`Server running on http://localhost:${port}`);