import CreateShop from "./_components/CreateShop";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const page = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const step = Number(params?.step);
  return <CreateShop newStep={step} />;
};

export default page;
