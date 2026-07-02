import { BuilderProfileClient } from "@/components/pages/builder-profile-client";

export default async function BuilderProfilePage({ params }) {
  const { uid } = await params;
  return <BuilderProfileClient uid={uid} />;
}

export async function generateStaticParams() {
  return [{ uid: "demo" }];
}
