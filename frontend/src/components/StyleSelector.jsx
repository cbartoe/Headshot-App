import { Check } from 'lucide-react';

const styles = [
  {
    id: 'corporate-classic',
    name: 'Corporate Classic',
    description: 'Traditional business headshot with neutral background',
    icon: '💼',
  },
  {
    id: 'creative-professional',
    name: 'Creative Professional',
    description: 'Modern, approachable style with subtle creative elements',
    icon: '🎨',
  },
  {
    id: 'executive-portrait',
    name: 'Executive Portrait',
    description: 'Premium, high-end professional portrait style',
    icon: '👔',
  },
];

const StyleSelector = ({ selectedStyle, onStyleSelect }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Choose Your Style
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleSelect(style.id)}
            className={`
              relative p-6 rounded-lg border-2 text-left transition-all duration-200
              ${selectedStyle === style.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }
            `}
          >
            {selectedStyle === style.id && (
              <div className="absolute top-3 right-3">
                <Check className="h-5 w-5 text-blue-500" />
              </div>
            )}

            <div className="text-3xl mb-3">{style.icon}</div>

            <h4 className="font-semibold text-gray-900 mb-2">
              {style.name}
            </h4>

            <p className="text-sm text-gray-600">
              {style.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
