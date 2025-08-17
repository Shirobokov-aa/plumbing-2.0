import ClientPage from './client-page';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <ClientPage params={resolvedParams} />;
}
