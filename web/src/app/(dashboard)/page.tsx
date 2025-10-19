import { prisma } from "@/services/db";

export default async function Home() {
  const data = await prisma.user.findMany();

  return <div>{JSON.stringify(data)}</div>;
}
