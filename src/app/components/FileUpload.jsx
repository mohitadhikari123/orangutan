"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [newUsers, setNewUsers] = useState([]);
  const [alreadyStored, setAlreadyStored] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setNewUsers([]);
    setAlreadyStored([]);
    setErrors([]);
    setStatus("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setStatus("Please select a file to upload.");
      return;
    }

    // Parse the CSV file using PapaParse library
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        try {
          const response = await axios.post("/api/uploadFile", result.data, {
            headers: { "Content-Type": "application/json" },
          });

          setStatus(response.data.message || "Upload successful!");

          // Set new users and already stored users from response
          setNewUsers(response.data.newlyInsertedRecords || []);
          setAlreadyStored(response.data.alreadyStoredRecords || []);
          setErrors(response.data.errors || []);
        } catch (error) {
          setErrors(error.response?.data?.errors || "An error occurred.");
        }
      },
      error: () => {
        setStatus("Error parsing CSV file.");
      },
    });
  };

  if (!isClient) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center gap-5"
    >
      <div className="file-upload flex justify-center items-center flex-col">
        <h2 className="text-xl text-gray-600 font-bold mb-4">Upload CSV File</h2>

        <div className="flex flex-col">
          <label
            htmlFor="file"
            className="mb-2 text-sm font-semibold text-gray-700"
          >
            Choose CSV file:
          </label>
          <div className="flex item gap-5">
            <input
              type="file"
              id="file"
              accept=".csv"
              onChange={handleFileChange}
              className="p-2 border rounded border-neutral-950"
              name="file"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 px-4 py-3 text-gray-200 rounded hover:bg-blue-600"
            >
              Upload
            </button>
          </div>
        </div>

        {status && <p className="mt-4 text-black text-sm">{status}</p>}

        {/* Display newly inserted users */}
        {newUsers.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">
              Users Added to the Database:
            </h3>
            <ul className="mt-4">
              {newUsers.map((user, index) => (
                <li key={index} className="border-b py-2">
                  {user.first_name} {user.middle_name} {user.last_name} -{" "}
                  {user.phone_number}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display already stored (duplicate) users */}
        {alreadyStored.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-red-600">
              Already Stored (Duplicates):
            </h3>
            <ul className="mt-4">
              {alreadyStored.map((user, index) => (
                <li key={index} className="border-b py-2 text-red-600">
                  {user.first_name} {user.middle_name} {user.last_name} -{" "}
                  {user.phone_number}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display errors (if any) */}
        {errors.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-red-600">Errors:</h3>
            <ul className="mt-4">
              {errors.map((error, index) => (
                <li key={index} className="text-red-600">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </form>
  );
}
