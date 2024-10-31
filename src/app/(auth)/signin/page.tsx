import { signIn } from "../../api/auth/[...nextauth]/options";

const singinPage = () => {
  return (
    <>
      <form
        action={
          async (formData) => {
            "use server";
            const result = await signIn("credentials", formData);
            console.log(result);
          }
        }
      >
        <input type="email" placeholder="Email" name="usernameOrEmail"/>
        <input type="password" placeholder="Password" name="password"/>
        <button type="submit">Sign in</button>
      </form>
      <form
        action={
          async () => {
            "use server";
            const result = await signIn("google");
            console.log(result);
          }
        }
      >
        <button type="submit">Sign in with Google</button>
      </form>
    </>
  );
}

export default singinPage;