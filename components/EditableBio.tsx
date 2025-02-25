"use client";

import { useState } from "react";
import { Button } from "./ui/button";

interface EditableBioProps {
  initialBio: string;
  onSave: (bio: string) => void;
}

export default function EditableBio({ initialBio, onSave }: EditableBioProps) {
  const [bio, setBio] = useState(initialBio);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    onSave(bio);
  };

  return (
    <div className="p-4 border rounded-lg">
      {isEditing ? (
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={4}
        />
      ) : (
        <p className="text-gray-700">{bio || "Click edit to add a bio..."}</p>
      )}

      <div className="mt-2">
        {isEditing ? (
          <Button onClick={handleSave} className="mr-2">
            Save
          </Button>
        ) : (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
