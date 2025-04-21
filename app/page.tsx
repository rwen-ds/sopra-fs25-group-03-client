//app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/unlogged');
}
// export default function TestPage() {
//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="bg-white p-10 rounded-2xl shadow-lg text-center space-y-4">
//         <h1 className="text-2xl font-bold !text-blue-500">Tailwind Test</h1>
//         <p className="!text-gray-700">If you can see this with styles, Tailwind is working!</p>
//         <button className="!bg-blue-500 !text-white py-2 px-6 rounded-full hover:bg-blue-600">
//           Test Button
//         </button>
//       </div>
//     </div>
//   );
// }
