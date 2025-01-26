import User from "../../../models/user.model.js";
import { Connect } from "../../../dbConfig/dbConfig.jsx";
import { transformCSVData } from "../../../utils/transformCSVUtils.jsx";
import { NextResponse } from "next/server"; // Import NextResponse

export const config = {
  api: {
    bodyParser: true, 
  },
};

export async function POST(req) {
  console.log("POST request received");
  const validData = [];
  const alreadyStored = [];
  const errors = [];
  try {
    // Parse JSON data from the request body
    const body = await req.json();
    console.log("Received CSV data as JSON:", body);

    if (!Array.isArray(body) || body.length === 0) {
      console.error("Invalid or empty CSV data received");
      return NextResponse.json(
        { error: "Invalid or empty CSV data received" },
        { status: 400 }
      );
    }

    // Transform the parsed CSV data
    const transformedData = transformCSVData(body);
    console.log("Transformed CSV data:", transformedData);

    await Connect();
    console.log("Database connected");

    // Check for duplicate phone numbers
    for (const userData of transformedData) {
      const existingUser = await User.findOne({
        phone_number: userData.phone_number,
      });

      if (existingUser) {
        alreadyStored.push(existingUser); 
        errors.push(`Phone number ${userData.phone_number} already exists in the database.`);
        continue; 
      } else if (userData.phone_number === "") {
        errors.push(`Phone number is empty for: ${userData.first_name} ${userData.last_name}`);
        continue; 
      }

      validData.push(userData); 
    }

    let savedData = [];
    if (validData.length > 0) {
      savedData = await User.insertMany(validData, { ordered: false });
      console.log("Data saved to database:", savedData);
    }

    // Return response with both success and error details
    return NextResponse.json(
      {
        message: validData.length > 0
          ? "Some records were successfully uploaded and transformed!"
          : "No valid records to upload.",
        errors,
        newlyInsertedRecords: savedData,
        alreadyStoredRecords: alreadyStored,
      },
      { status: validData.length > 0 ? 200 : 400 }
    );
  } catch (error) {
    console.error("Error during processing:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
