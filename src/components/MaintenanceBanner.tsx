export default function MaintenanceBanner() {
  if (process.env.NEXT_PUBLIC_MAINTENANCE !== '1') return null;

  return (
    <div className="w-full bg-[#fff4d2] text-[#6b4e16] border-b border-[#e5d499] text-sm py-2 px-4 text-center">
      We’re improving things. Some actions may be slow. Thanks for your patience.
    </div>
  );
}
