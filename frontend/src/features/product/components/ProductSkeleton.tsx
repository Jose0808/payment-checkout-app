import React from 'react'

export const ProductSkeleton: React.FC = () => {
    return (
        <div className="card animate-pulse">
            {/* Image skeleton */}
            <div className="relative w-full h-72 mb-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-xl" />

            {/* Content skeleton */}
            <div className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                    <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg w-3/4" />
                    <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg w-1/2" />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-5/6" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-4/6" />
                </div>

                {/* Badges */}
                <div className="flex gap-2">
                    <div className="h-6 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-full" />
                    <div className="h-6 w-28 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-full" />
                </div>

                {/* Stock */}
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-32" />

                {/* Price */}
                <div className="pt-4 border-t">
                    <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg w-40 mb-4" />

                    {/* Button */}
                    <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-xl" />
                </div>
            </div>
        </div>
    )
}