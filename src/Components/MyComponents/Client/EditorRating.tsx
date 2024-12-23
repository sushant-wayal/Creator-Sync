"use client";

import { rateEditor } from "@/actions/editor";
import { Button } from "@/Components/ui/button";
import { DialogFooter } from "@/Components/ui/dialog";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditorRatingProps {
  editorId: string;
}

export const EditorRating : React.FC<EditorRatingProps> = ({ editorId }) => {
  const router = useRouter();
  const [rating, setRating] = useState<number>(-1);
  const [hover, setHover] = useState<number>(0);
  const [hovering, setHovering] = useState<boolean>(false);
  return (
    <>
      <div className="space-y-4">
        <p className="font-semibold">Rating</p>
        <div className="flex items-center justify-start gap-3">
          {[...Array(5)].map((_, index) => {
            return (
              <Star
                onMouseEnter={() => {
                  setHover(index)
                  setHovering(true)
                }}
                onMouseLeave={() => {
                  setHover(rating)
                  setHovering(false)
                }}
                onClick={() => {setRating(index)}}
                color="black"
                className={`cursor-pointer ${(hovering && index <= hover) || (!hovering && index <= rating)  ? 'fill-primary' : ''}`}
              />
            );
          })}
        </div>
        <p className="text-sm text-gray-500">
          {rating == -1 ? '' : rating == 0 ? 'Poor' : rating == 1 ? 'Fair' : rating == 2 ? 'Good' : rating == 3 ? 'Very Good' : 'Excellent'}
        </p>
      </div>
      <DialogFooter>
        <Button
          onClick={async () => {
            await rateEditor(editorId, rating+1)
            router.refresh()
          }}
          disabled={rating == -1}
        >
          Submit Rating
        </Button>
      </DialogFooter>
    </>
  )
}