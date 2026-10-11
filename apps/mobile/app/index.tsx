import { Redirect } from "expo-router";

// "/" = home = Colección; the guards in _layout send signed-out users to sign-in.
export default function Index() {
  return <Redirect href="/collection" />;
}
