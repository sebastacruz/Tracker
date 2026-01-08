/**
 * Navbar component - Minimal header
 * Empty navbar to maintain layout consistency
 */
import PropTypes from 'prop-types';

export default function Navbar() {
  return (
    <nav className="bg-secondary border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">{/* Empty navbar - maintains spacing */}</div>
    </nav>
  );
}

Navbar.propTypes = {};
