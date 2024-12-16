import { getEditors } from "@/actions/editor";
import { Footer } from "@/Components/MyComponents/Footer";
import { NewProjectForm } from "@/Components/MyComponents/Forms/NewProjectForm";
import { Navbar } from "@/Components/MyComponents/Navbar";

const NewProjectPage = async ({  }) => {
  const initialEditors = await getEditors();
  return (
    <div className="flex flex-col justify-between items-center gap-4 w-lvw min-h-lvh">
      <Navbar links={[
        {name: "Dashboard", url: "/dashboard"},
        {name: "New Project", url: "/new-project"},
        {name: "Profile", url: "/profile"},
        {name: "Logout", url: "/logout"},
      ]}/>
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