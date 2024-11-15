import { NextApiRequest, NextApiResponse } from "next";

interface SignupData {
  email: string;
  username: string;
  profilePicture: string;
  password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, username, profilePicture, password }: SignupData = req.body;

  // Add your validation and save logic here. For example:
  // - Check if the email or username already exists
  // - Hash the password before storing

  res.status(200).json({ message: "Signup successful!" });
}
