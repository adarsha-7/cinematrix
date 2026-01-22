import { PaginationProps } from '../types';

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const getPages = () => {
        const pages = [];

        let start = Math.max(1, currentPage - 1);
        let end = Math.min(totalPages, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const baseBtn = 'h-10 w-10 rounded-md text-sm font-medium transition';

    const enabledBtn = 'bg-zinc-800 text-white hover:bg-zinc-700 cursor-pointer';

    const disabledBtn = 'bg-zinc-800 text-white opacity-40 cursor-default';

    return (
        <div className="mt-10 flex justify-center gap-4">
            {/* First */}
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(1)}
                className={`${baseBtn} ${currentPage === 1 ? disabledBtn : enabledBtn}`}
            >
                «
            </button>

            {/* Previous (−5 pages) */}
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(Math.max(1, currentPage - 5))}
                className={`${baseBtn} ${currentPage === 1 ? disabledBtn : enabledBtn}`}
            >
                ←
            </button>

            {/* Page numbers */}
            {getPages().map((page) => {
                const isActive = page === currentPage;

                return (
                    <button
                        key={page}
                        title={`Page ${page}`}
                        onClick={() => onPageChange(page)}
                        className={`${baseBtn} ${isActive ? 'cursor-default bg-yellow-400 text-zinc-800' : enabledBtn}`}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Next (+5 pages) */}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 5))}
                className={`${baseBtn} ${currentPage === totalPages ? disabledBtn : enabledBtn}`}
            >
                →
            </button>

            {/* Last */}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
                className={`${baseBtn} ${currentPage === totalPages ? disabledBtn : enabledBtn}`}
            >
                »
            </button>
        </div>
    );
}
