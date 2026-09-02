import toast from "react-hot-toast";

type DownloadInvoiceFn = (
  orderId: number,
  filename?: string,
) => Promise<void>;

export function useDownloadInvoice(
  mutation: {
    unwrap: () => Promise<Blob>;
  },
  filename?: string,
): { handleDownload: DownloadInvoiceFn; isPending: boolean } {
  const handleDownload = async (orderId: number, name?: string) => {
    try {
      const blob = await mutation.unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name ?? filename ?? "invoice.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Couldn't download invoice");
    }
  };

  return { handleDownload, isPending: false };
}
