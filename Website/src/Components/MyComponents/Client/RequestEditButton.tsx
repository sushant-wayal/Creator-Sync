"use client";

import { requestEdit } from "@/actions/requestEdit";
import { Button } from "@/Components/ui/button";

interface RequestEditButtonProps {
  projectId: string;
}

export const RequestEditButton : React.FC<RequestEditButtonProps> = ({projectId}) => {
  return (
    <Button onClick={async () => await requestEdit(projectId)}>
      Request Edit
    </Button>
  );
};