import { getAbout } from "@/lib/data";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const about = await getAbout();
  return <LoginForm logo={about?.logo} />;
}
