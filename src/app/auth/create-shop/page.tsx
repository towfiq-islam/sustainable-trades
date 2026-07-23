import CreateShop from "./_components/CreateShop";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const step = params.step;

  return <CreateShop/>;
};

export default page;
