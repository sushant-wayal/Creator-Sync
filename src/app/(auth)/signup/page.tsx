import { db } from "@/lib/db";
import { hash } from "bcryptjs";

const signupPage = () => {
  return (
    <form
      action={
        async (formData) => {
          "use server";
          const pwHash = await hash(formData.get('password') as string, 10);
          const user = await db.user.create({
            data: {
              email: formData.get('email') as string,
              username: formData.get('username') as string,
              password: pwHash,
              name: formData.get('name') as string,
              emailVerified: false,
            },
          });
          console.log(user);
        }
      }
    >
      <input type="text" name="username" placeholder="username"/>
      <input type="email" name="email" placeholder="email"/>
      <input type="password" name="password" placeholder="password"/>
      <input type="text" name="name" placeholder="name"/>
      <button type="submit">Sign up</button>
    </form>
  );
}

export default signupPage;