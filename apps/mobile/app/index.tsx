import { Redirect } from "expo-router";
import { useSession } from "../src/lib/auth";

// "/" = home: Colección when signed in, sign-in otherwise. Redirecting unconditionally to the protected
// /collection loops back here when signed out (the guard falls back to the index route).
export default function Index() {
  const session = useSession();
  return <Redirect href={session ? "/collection" : "/sign-in"} />;
}
