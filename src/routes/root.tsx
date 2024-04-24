import { getToken } from "@/api/spotify";

export default function Root() {
  const { accessToken } = useAuthProvider();

  return (
    <>
      <div>
        <h1>Music Tracker</h1>
        <a href="contacts">Your songs</a>
      </div>
    </>
  );
}