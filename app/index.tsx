// Root path: home screen (tabs). Auth gate redirects unauthenticated users to login.
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)" />;
}
