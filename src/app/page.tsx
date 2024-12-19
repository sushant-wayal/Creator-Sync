import { HomeEmailInput } from "@/Components/MyComponents/Client/HomeEmailInput";
import { Footer } from "@/Components/MyComponents/General/Footer";
import { PublicNavbar } from "@/Components/MyComponents/General/PublicNavbar";
import { Button } from "@/Components/ui/button";
import { websiteName } from "@/constants";
import { PencilIcon, Users, Youtube } from "lucide-react";
import Link from "next/link";

const Home = () => {
  const features = [
    {
      logo: "Youtube",
      title: "Youtube Dashboard",
      description: "Manage your projects, communicate with editors, and track progress all in one place."
    },
    {
      logo: "PencilIcon",
      title: "Editor Marketplace",
      description: "Find skilled editors, review portfolios, and hire the perfect match for your content."
    },
    {
      logo: "Users",
      title: "Seamless Collaboration",
      description: "Real-time communication, file sharing, and project management tools to streamline your workflow."
    }
  ]
  return (
    <>
      <div className="w-full">
        <PublicNavbar/>
        <div className="h-lvh w-lvh flex flex-col justify-center items-center gap-3">
          <h2 className="text-6xl font-bold">Collaborate, Create, Conquer</h2>
          <h3 className="text-xl text-gray-600 w-1/2 text-center">
            Connect YouTubers with skilled editors. Streamline your content creation process and take your channel to the next level.
          </h3>
          <HomeEmailInput />
        </div>
        <div className="w-lvh flex flex-wrap justify-evenly items-center bg-gray-200 py-16">
          {features.map(({ logo, title, description }, ind) => (
            <div key={ind} className="w-1/4 flex flex-col items-center gap-4">
              {logo === "Youtube" && <Youtube size={64} />}
              {logo === "PencilIcon" && <PencilIcon size={64} />}
              {logo === "Users" && <Users size={64} />}
              <h3 className="text-2xl font-bold">{title}</h3>
              <p className="text-gray-600 text-center">{description}</p>
            </div>
          ))}
        </div>
        <div className="w-lvw py-40 flex flex-col justify-center items-center gap-4">
          <h2 className="text-4xl font-bold text-center">
            Ready to revolutionize your content creation?
          </h2>
          <h3 className="text-xl text-gray-600 text-center">
            Join {websiteName} today and experience the power of seamless collaboration.
          </h3>
          <Link href="/signup">
            <Button>Sign up Now</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
