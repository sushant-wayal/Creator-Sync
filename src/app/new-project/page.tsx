import { getEditors } from "@/actions/editor";
import { Footer } from "@/Components/MyComponents/General/Footer";
import { NewProjectForm } from "@/Components/MyComponents/Forms/NewProjectForm";
import { UserNavbar } from "@/Components/MyComponents/General/UserNavbar";
import { auth } from "@/auth";

const NewProjectPage = async ({  }) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const initialEditors = await getEditors();
  return (
    <div className="flex flex-col justify-between items-center gap-4 w-lvw min-h-lvh">
      <UserNavbar/>
      <div className="flex flex-col justify-start items-center gap-4 w-5/6 max-w-[900px]">
        <h1 className="text-4xl font-bold text-black text-left w-full">
          Create New Project
        </h1>
        <NewProjectForm initialEditors={initialEditors} />
      </div>
      <Footer />
    </div>
  )
}

export default NewProjectPage;