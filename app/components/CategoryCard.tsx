import type { Category } from '../types/index';

export default function CategoryCard({ category }: { category: Category }) {
    return (
        <div className="cursor-pointer rounded-xl border border-gray-700 bg-[#111] py-6 text-center transition hover:border-red-600">
            <h3 className="text-lg font-bold">{category.name}</h3>
            <p className="text-xs text-gray-400">{category.count} Movies</p>
        </div>
    );
}
