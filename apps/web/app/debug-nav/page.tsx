import { navigationItems } from '@/lib/navigation';

export default function DebugNavPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Navigation Debug</h1>
      <p className="mb-4">Total navigation items: {navigationItems.length}</p>
      
      <div className="space-y-2">
        {navigationItems.map((item, index) => (
          <div key={item.href} className="p-2 border rounded">
            <p className="font-semibold">{index + 1}. {item.title} - {item.href}</p>
            {item.children && (
              <p className="text-sm text-gray-600">Has {item.children.length} children</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}