export default function LoadingView() {
  return (
    <main className="bg-base-200 p-4 flex flex-col items-center">
      <div className="max-w-xl flex flex-col gap-4">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    </main>
  );
}
