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
    <div className="rounded-lg border p-4">
      {isEditing ? (
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full rounded-md border p-2"
          rows={4}
        />
      ) : (
        <p className="text-neutral-700">{bio || "Click edit to add a bio..."}</p>
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
