"use client";

import ClientPage from './client-page';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: PageProps) {
  return <ClientPage params={params as unknown as { id: string }} />;
}
