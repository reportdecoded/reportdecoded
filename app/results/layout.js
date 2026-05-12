// Results pages contain personal customer data (uploaded PDFs, property addresses,
// defect lists). They must NEVER be indexed by search engines.
export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function ResultsLayout({ children }) {
  return children;
}
