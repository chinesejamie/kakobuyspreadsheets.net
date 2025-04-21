import DeadLinkForm from '@/components/DeadLinkForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Report Dead Product Link | KakoBuy Spreadsheet',
  description: 'Report a dead spreadsheet or Taobao/Weidian product link to our team. Get notified when a fix is available.',
};

export default function DeadLinkReportPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6 sm:p-8">
        <DeadLinkForm />
      </div>
    </div>
  );
}
