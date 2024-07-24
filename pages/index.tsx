"use client";

import withAuth from "@/components/withAuth";

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome Inside!</h1>
    </main>
  );
}

export default withAuth(Home, true);
