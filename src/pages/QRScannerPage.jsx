import QRScanner from '../components/QRScanner';
import { Link } from 'react-router-dom';

export default function QRScannerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Retour à l'accueil
        </Link>
      </div>

      <QRScanner />
    </div>
  );
}
