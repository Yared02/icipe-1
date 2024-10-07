// pages/group/[id]/group.tsx
import { useRouter } from 'next/router';

const GroupPage = () => {
  const router = useRouter();
  const { id } = router.query; // Extracts the dynamic 'id' from the URL

  if (!id) return <div>Loading...</div>; // Handle case where `id` is not yet available

  return (
    <div>
      <h1>Group Page</h1>
      <p>Welcome to the Group page for program ID: {id}</p>
    </div>
  );
};

export default GroupPage;
