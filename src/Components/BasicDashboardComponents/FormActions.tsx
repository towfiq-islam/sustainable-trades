// FormActions.tsx
interface FormActionsProps {
  isPending: boolean;
}

const FormActions = ({ isPending }: FormActionsProps) => (
  <div className="flex justify-end mt-5 md:mt-10 items-center">
    {/* <button
      type="button"
      className="text-red-600 flex items-center gap-1 mt-4 cursor-pointer border-2 px-5 py-3"
      onClick={() => console.log("Delete clicked")} 
    >
      Delete Listing
    </button> */}

    <button
      type="submit"
      disabled={isPending}
      className={`bg-accent-red duration-500 ease-in-out text-white py-2.5 md:py-5 px-6 md:px-12 flex items-center justify-center gap-2 cursor-pointer rounded-lg font-semibold hover:bg-[#a34739] mt-6 ${
        isPending ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isPending && (
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}
      {isPending ? "Request Approval..." : "Request Approval"}
    </button>
  </div>
);

export default FormActions;
