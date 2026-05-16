import ReportDecoded from '@/components/ReportDecoded';

export const metadata = {
  title: 'Report Decoded — AI Building Inspection Interpreter',
  description: 'Upload your Australian building and pest inspection report. Get a plain-English verdict, repair cost estimates, local tradies, and negotiation language in 60 seconds.',
  alternates: {
    canonical: 'https://www.reportdecoded.com.au/',
  },
};

export default function Page() {
  return <ReportDecoded />;
}
