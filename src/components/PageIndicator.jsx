/**
 * PageIndicator - Minimal dot indicators for swipe navigation
 * Clean, iOS-style dots showing current page position
 */
import PropTypes from 'prop-types';

const PAGE_LABELS = {
  entry: 'Entry',
  dashboard: 'Stats',
  history: 'History',
  substances: 'Flavors',
};

export default function PageIndicator({ pages, currentPage, onPageSelect }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex justify-center items-center
                    gap-2.5 py-5 pb-safe z-40"
    >
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageSelect(page)}
          className={`w-2 h-2 rounded-full transition-all duration-200
                     ${
                       currentPage === page
                         ? 'bg-emerald-500 scale-125'
                         : 'bg-slate-600 hover:bg-slate-500'
                     }`}
          aria-label={`Go to ${PAGE_LABELS[page]} page`}
          aria-current={currentPage === page ? 'page' : undefined}
        />
      ))}
    </div>
  );
}

PageIndicator.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentPage: PropTypes.string.isRequired,
  onPageSelect: PropTypes.func.isRequired,
};
