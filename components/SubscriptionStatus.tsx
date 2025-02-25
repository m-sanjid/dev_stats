import { useSession } from "next-auth/react";

const SubscriptionStatus = () => {
  const { data: session } = useSession();
  const plan;
  return <div>SubscriptionStatus</div>;
};

export default SubscriptionStatus;
