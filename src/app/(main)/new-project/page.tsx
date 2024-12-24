import { getEditors } from "@/actions/editor";
import { NewProjectForm } from "@/Components/MyComponents/Forms/NewProjectForm";
import { auth } from "@/auth";
import type { Metadata } from "next";
import { websiteName } from "@/constants";

export const metadata: Metadata = {
  title: `New Project | ${websiteName}`,
  description: "Create a new project on Creator Sync",
};

const NewProjectPage = async ({  }) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const initialEditors = await getEditors();
  return (
    <div className="flex flex-col justify-start items-center gap-4 w-5/6 max-w-[900px]">
      <h1 className="text-4xl font-bold text-black text-left w-full">
        Create New Project
      </h1>
      <NewProjectForm initialEditors={initialEditors} />
    </div>
  )
}

export default NewProjectPage;