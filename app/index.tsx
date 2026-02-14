// Root path: redirect to login (auth will then send to (tabs) if logged in)
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
