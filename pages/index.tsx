"use client";

import withAuth from "@/components/withAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();

  useEffect(()=>{
    router.push('/chats')
  }, [router]);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome Inside!</h1>
    </main>
  );
}

export default withAuth(Home, true);
