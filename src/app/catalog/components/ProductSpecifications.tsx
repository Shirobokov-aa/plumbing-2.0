interface ProductSpecificationsProps {
  specifications: Record<string, any>
}

export function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Характеристики</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {Object.entries(specifications || {}).map(([key, value]) => (
          <div key={key} className="contents">
            <div className="text-gray-500">{key}</div>
            <div>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
