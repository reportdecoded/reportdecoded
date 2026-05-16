import ReportDecoded from '@/components/ReportDecoded';

export const metadata = {
  title: 'Report Decoded — AI Building Inspection Interpreter',
  description: 'Upload your Australian building & pest inspection PDF. Plain-English verdict, repair costs, local tradies and negotiation amount — in 60 seconds.',
  alternates: {
    canonical: 'https://www.reportdecoded.com.au/',
  },
};

export default function Page() {
  return <ReportDecoded />;
}
